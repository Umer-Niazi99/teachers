let express = require('express')
let app = express();
let cors = require('cors')
app.use(cors());
app.use(express.json());
require('dotenv').config();
let { createClient } = require("@supabase/supabase-js");

let supabaseurl = process.env.SUPABASEURL;
let supabasekey = process.env.SUPABASEKEY;

if (!supabaseurl || !supabasekey) {
  console.error('Missing SUPABASEURL or SUPABASEKEY in .env');
  process.exit(1);
}

let supabase = createClient(supabaseurl, supabasekey)

// read all teachers
app.get('/readteacher', async (req, res) => {
  let { data, error } = await supabase.from('teachers').select('*')

  if (error) {
    console.log('readteacher error:', error);
    return res.status(500).json({ status: 'not readed', error: error.message })
  }

  res.json(data)
})

// add a teacher
app.post('/addteacher', async (req, res) => {
  let { name, salary, subject, city, gender } = req.body;
  console.log('addteacher body:', name, salary, subject, city, gender);

  if (!name) {
    return res.status(400).send('added failed: name is required')
  }

  let { data, error } = await supabase
    .from('teachers')
    .insert({ name, salary, subject, city, gender })
    .select()

  if (error) {
    console.log('addteacher error:', error);
    return res.status(500).send('added failed')
  }

  res.send('teacher added')
})

// delete a teacher
app.post('/deleteteacher', async (req, res) => {
  let id = req.body.id
  if (!id) return res.status(400).send('deleted failed: id is required')

  let { data, error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id)
    .select()

  if (error) {
    console.log('deleteteacher error:', error);
    return res.status(500).send('deleted failed')
  }

  res.send('teacher deleted')
})

// delete all teachers
app.post('/deleteallteachers', async (req, res) => {
  let { data, error } = await supabase
    .from('teachers')
    .delete()
    .not('id', 'is', null)
    .select()

  if (error) {
    console.log('deleteallteachers error:', error);
    return res.status(500).send('delete all failed')
  }

  res.send('all teachers deleted')
})

// update a teacher
app.post('/updateteacher', async (req, res) => {
  let { name, salary, subject, city, gender, id } = req.body;
  console.log('updateteacher body:', name, salary, subject, city, gender, id);

  if (!id) return res.status(400).send('update failed: id is required')

  let { data, error } = await supabase
    .from('teachers')
    .update({ name, salary, subject, city, gender })
    .eq('id', id)
    .select()

  if (error) {
    console.log('updateteacher error:', error);
    return res.status(500).send('update failed')
  }

  res.send('teacher update')
})

// get one teacher (for editing)
app.post('/updatesingleteacher', async (req, res) => {
  let id = req.body.id
  if (!id) return res.status(400).json({ status: 'not edit', error: 'id is required' })

  let { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)

  if (error) {
    console.log('updatesingleteacher error:', error);
    return res.status(500).json({ status: 'not edit', error: error.message })
  }

  res.json(data)
})

app.listen(5000, () => console.log('server running on port 5000'));