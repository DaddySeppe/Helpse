const { supabase } = require("../utils/supabase");

async function getTasks(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return res.json({ tasks: data || [] });
  } catch (error) {
    return next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single();

    if (error || !data) {
      return res.status(404).json({ message: "Taak niet gevonden." });
    }

    return res.json({ task: data });
  } catch (error) {
    return next(error);
  }
}

async function createTask(req, res, next) {
  try {
    if (req.user.role !== "CUSTOMER") {
      return res.status(403).json({ message: "Alleen klanten kunnen taken posten." });
    }

    const { title, description, category, location, price, task_date } = req.body;

    if (!title || !description || !category || !location || !price || !task_date) {
      return res.status(400).json({ message: "Vul alle verplichte velden in." });
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title,
        description,
        category,
        location,
        price,
        task_date,
        status: "OPEN",
        customer_id: req.user.id,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({ task: data });
  } catch (error) {
    return next(error);
  }
}

async function getMyTasks(req, res, next) {
  try {
    let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });

    if (req.user.role === "CUSTOMER") {
      query = query.eq("customer_id", req.user.id);
    } else {
      query = query.eq("assigned_student_id", req.user.id);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return res.json({ tasks: data || [] });
  } catch (error) {
    return next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingTask) {
      return res.status(404).json({ message: "Taak niet gevonden." });
    }

    if (existingTask.customer_id !== req.user.id) {
      return res.status(403).json({ message: "Je mag deze taak niet beheren." });
    }

    const updates = { ...req.body, updated_at: new Date().toISOString() };
    delete updates.id;
    delete updates.customer_id;

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return res.json({ task: data });
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("id, customer_id")
      .eq("id", id)
      .single();

    if (fetchError || !task) {
      return res.status(404).json({ message: "Taak niet gevonden." });
    }

    if (task.customer_id !== req.user.id) {
      return res.status(403).json({ message: "Je mag deze taak niet verwijderen." });
    }

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
};
