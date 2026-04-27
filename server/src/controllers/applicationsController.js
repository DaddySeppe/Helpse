const { supabase } = require("../utils/supabase");

async function applyToTask(req, res, next) {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ message: "Alleen studenten kunnen zich aanmelden." });
    }

    const { id: taskId } = req.params;
    const { message } = req.body;

    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      return res.status(404).json({ message: "Taak niet gevonden." });
    }

    if (task.customer_id === req.user.id) {
      return res.status(400).json({ message: "Je kan niet reageren op je eigen taak." });
    }

    if (task.status !== "OPEN") {
      return res.status(400).json({ message: "Deze taak is niet meer open." });
    }

    const { data: existingApplication } = await supabase
      .from("applications")
      .select("id")
      .eq("task_id", taskId)
      .eq("student_id", req.user.id)
      .maybeSingle();

    if (existingApplication) {
      return res.status(409).json({ message: "Je bent al aangemeld voor deze taak." });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        task_id: taskId,
        student_id: req.user.id,
        message: message || "",
        status: "PENDING",
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({ application: data });
  } catch (error) {
    return next(error);
  }
}

async function getMyApplications(req, res, next) {
  try {
    let query = supabase
      .from("applications")
      .select("*, tasks(*)")
      .order("created_at", { ascending: false });

    if (req.user.role === "STUDENT") {
      query = query.eq("student_id", req.user.id);
    } else {
      const { data: myTaskIds } = await supabase
        .from("tasks")
        .select("id")
        .eq("customer_id", req.user.id);

      const taskIds = (myTaskIds || []).map((task) => task.id);
      if (taskIds.length === 0) {
        return res.json({ applications: [] });
      }
      query = query.in("task_id", taskIds);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return res.json({ applications: data || [] });
  } catch (error) {
    return next(error);
  }
}

async function getTaskApplications(req, res, next) {
  try {
    const { id: taskId } = req.params;

    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, customer_id")
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      return res.status(404).json({ message: "Taak niet gevonden." });
    }

    if (task.customer_id !== req.user.id) {
      return res.status(403).json({ message: "Je mag deze aanmeldingen niet bekijken." });
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return res.json({ applications: data || [] });
  } catch (error) {
    return next(error);
  }
}

async function setApplicationStatus(req, res, next, status) {
  try {
    const { id } = req.params;

    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("*, tasks(*)")
      .eq("id", id)
      .single();

    if (appError || !application) {
      return res.status(404).json({ message: "Aanmelding niet gevonden." });
    }

    if (!application.tasks || application.tasks.customer_id !== req.user.id) {
      return res.status(403).json({ message: "Je mag deze aanmelding niet beheren." });
    }

    const { data: updatedApplication, error: updateError } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      throw updateError;
    }

    if (status === "ACCEPTED") {
      await supabase
        .from("applications")
        .update({ status: "REJECTED" })
        .eq("task_id", application.task_id)
        .neq("id", id)
        .eq("status", "PENDING");

      await supabase
        .from("tasks")
        .update({
          status: "ASSIGNED",
          assigned_student_id: application.student_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.task_id);
    }

    return res.json({ application: updatedApplication });
  } catch (error) {
    return next(error);
  }
}

async function acceptApplication(req, res, next) {
  return setApplicationStatus(req, res, next, "ACCEPTED");
}

async function rejectApplication(req, res, next) {
  return setApplicationStatus(req, res, next, "REJECTED");
}

module.exports = {
  applyToTask,
  getMyApplications,
  getTaskApplications,
  acceptApplication,
  rejectApplication,
};
