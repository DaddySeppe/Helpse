-- Password for all users: test1234
-- bcrypt hash: $2b$10$fBMXOfSN8N1dNIMc7eUkSeU6u6.ZZM/mZ4T9odkISWL9Q2.hk2A.q

insert into users (id, name, email, password_hash, role, subscription_status, trial_ends_at, stripe_customer_id, stripe_subscription_id)
values
  ('11111111-1111-1111-1111-111111111111', 'An Peeters', 'an.customer@helpse.be', '$2b$10$fBMXOfSN8N1dNIMc7eUkSeU6u6.ZZM/mZ4T9odkISWL9Q2.hk2A.q', 'CUSTOMER', 'ACTIVE', now() + interval '3 days', 'cus_helpse_1', 'sub_helpse_1'),
  ('22222222-2222-2222-2222-222222222222', 'Mila Jacobs', 'mila.student@helpse.be', '$2b$10$fBMXOfSN8N1dNIMc7eUkSeU6u6.ZZM/mZ4T9odkISWL9Q2.hk2A.q', 'STUDENT', 'ACTIVE', now() + interval '3 days', 'cus_helpse_2', 'sub_helpse_2'),
  ('33333333-3333-3333-3333-333333333333', 'Koen Vermeulen', 'koen.customer@helpse.be', '$2b$10$fBMXOfSN8N1dNIMc7eUkSeU6u6.ZZM/mZ4T9odkISWL9Q2.hk2A.q', 'CUSTOMER', 'TRIAL', now() + interval '2 days', null, null),
  ('44444444-4444-4444-4444-444444444444', 'Lotte Martens', 'lotte.student@helpse.be', '$2b$10$fBMXOfSN8N1dNIMc7eUkSeU6u6.ZZM/mZ4T9odkISWL9Q2.hk2A.q', 'STUDENT', 'TRIAL', now() + interval '2 days', null, null)
on conflict (id) do nothing;

insert into tasks (id, title, description, category, location, price, task_date, status, customer_id, assigned_student_id)
values
  ('aaaa1111-1111-1111-1111-111111111111', 'Computer hulp thuis', 'Laptop is traag en printer werkt niet.', 'Computerhulp', 'Leuven', 45.00, current_date + 2, 'OPEN', '11111111-1111-1111-1111-111111111111', null),
  ('aaaa2222-2222-2222-2222-222222222222', 'Tuin opfrissen', 'Onkruid verwijderen en gras maaien.', 'Tuinwerk', 'Mechelen', 60.00, current_date + 4, 'OPEN', '33333333-3333-3333-3333-333333333333', null),
  ('aaaa3333-3333-3333-3333-333333333333', 'Verhuis dozen dragen', 'Hulp nodig voor 2 uur bij verhuis.', 'Verhuizen', 'Antwerpen', 80.00, current_date + 6, 'ASSIGNED', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
  ('aaaa4444-4444-4444-4444-444444444444', 'Boodschappen doen', 'Wekelijkse boodschappen ophalen.', 'Boodschappen', 'Gent', 30.00, current_date + 1, 'OPEN', '33333333-3333-3333-3333-333333333333', null),
  ('aaaa5555-5555-5555-5555-555555555555', 'Hond uitlaten', 'Wandeling van 45 minuten.', 'Hond uitlaten', 'Brugge', 20.00, current_date + 3, 'OPEN', '11111111-1111-1111-1111-111111111111', null),
  ('aaaa6666-6666-6666-6666-666666666666', 'Fiets herstellen', 'Band vervangen en rem afstellen.', 'Kleine herstellingen', 'Hasselt', 35.00, current_date + 5, 'OPEN', '33333333-3333-3333-3333-333333333333', null),
  ('aaaa7777-7777-7777-7777-777777777777', 'Schoonmaak appartement', 'Keuken en badkamer grondig reinigen.', 'Schoonmaak', 'Kortrijk', 70.00, current_date + 2, 'OPEN', '11111111-1111-1111-1111-111111111111', null),
  ('aaaa8888-8888-8888-8888-888888888888', 'IKEA kast in elkaar zetten', 'Kast met 3 deuren monteren.', 'Kleine herstellingen', 'Aalst', 55.00, current_date + 7, 'OPEN', '33333333-3333-3333-3333-333333333333', null)
on conflict (id) do nothing;

insert into applications (id, task_id, student_id, message, status)
values
  ('bbbb1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Ik kan vandaag al langskomen.', 'PENDING'),
  ('bbbb2222-2222-2222-2222-222222222222', 'aaaa3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Ik heb ervaring met verhuizingen.', 'ACCEPTED'),
  ('bbbb3333-3333-3333-3333-333333333333', 'aaaa7777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'Ik ben beschikbaar in de namiddag.', 'PENDING')
on conflict (id) do nothing;
