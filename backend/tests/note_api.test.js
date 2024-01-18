const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../tests/test_helper')

//superagent object is assigned to the api variable and tests can use it for making http requests
//also supertest takes care that the application being tested is started at the port that it uses internally
const api = supertest(app)
const Note = require('../models/note')

const bcrypt = require('bcrypt')
const User = require('../models/user')




describe('when there is initially some notes saved', () => {

    beforeEach(async () => {
        await Note.deleteMany({})
        await Note.insertMany(helper.initialNotes)
    })

    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
        const response = await api.get('/api/notes')

        expect(response.body).toHaveLength(helper.initialNotes.length)
    })

    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')

        const contents = response.body.map(r => r.content)

        expect(contents).toContain(
            'Browser can execute only JavaScript'
        )
    })
})


describe('addition of a new note', () => {
    test('a valid note can be added' ,async() => {
        const newNote = {
            content:'aysnc/await simplifies making aysnc calls',
            important:true,
        }
        await api.post('/api/notes').send(newNote).expect(201).expect('Content-Type', /application\/json/)

        const noteAtEnd = await helper.notesInDb()
        expect(noteAtEnd).toHaveLength(helper.initialNotes.length +1)

        const contents = noteAtEnd.map(r => r.content)
        expect(contents).toContain('aysnc/await simplifies making aysnc calls')
    })

    test('note without content is not added', async () => {
        const newNote = {
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)

        const noteAtEnd = await helper.notesInDb()

        expect(noteAtEnd).toHaveLength(helper.initialNotes.length)
    })
})

describe('viewing a specific note', () => {

    test('succeeds with a valid id',async() => {
        const notesAtStart = await helper.notesInDb()

        const noteToView = notesAtStart[0]

        const resultNote = await api.get(`/api/notes/${noteToView.id}`).expect(200).expect('Content-Type', /application\/json/)

        expect(resultNote.body).toEqual(noteToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    })
})

describe('deletion of a note', () => {
    test('Note can be deleted',async() => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length -1)

        const contents = notesAtEnd.map(n => n.content)
        expect(contents).not.toContain(noteToDelete.content)


    })
})


describe('when there is initially one user in db',() => {
    beforeEach(async() => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret',10)
        const user = new User({ username:'root', password: passwordHash })

        await user.save()
    })


    test('creation sucseeds with a fresh username', async() => {
        const usersAtStart = helper.usersInDb()

        const newUser = {
            username: 'Z0biris',
            name: 'Felix Tran',
            password :'salainen'
        }

        await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

        const usersAtEnd = helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length +1)
        const usernames = usersAtEnd.map(n => n.name)
        expect(usernames).toContain(newUser.name)

    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})



afterAll(async () => {
    await mongoose.connection.close()
})