// server/index.js
import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/games', (req, res) => {
  res.json([
    { id: 1, name: 'Klikni slovo', category: 'letters' },
    { id: 2, name: 'Što je nestalo?', category: 'memory' },
    { id: 3, name: 'Klikni životinju', category: 'reaction' }
  ])
})

app.post('/api/results', (req, res) => {
  const { stars, gameId } = req.body
  console.log(`Rezultat: ${stars} zvjezdica za igru ${gameId}`)
  res.json({ success: true })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`)
})
