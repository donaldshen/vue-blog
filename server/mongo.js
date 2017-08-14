const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const mongodbURI = require('config-lite')(__dirname).mongodbURI

let userCollection
let postCollection

(async function createDB () {
  let db
  try {
    db = await MongoClient.connect(mongodbURI)
    userCollection = await db.createCollection('user', {
      validator: {
        name: {
          $type: 'string',
        },
        password: {
          $type: 'string',
        },
        bio: {
          $type: 'string',
        },
      },
    })
    userCollection.createIndex({
      name: 1,
    }, {
      unique: true,
    })
    postCollection = await db.createCollection('post', {
      validator: {
        author: { $type: 'string' },
        title: { $type: 'string' },
        content: { $type: 'string' },
        access: { $in: ['public', 'private'] },
      },
    })
    postCollection.createIndex({
      author: 1,
      title: 1,
    }, {
      unique: true,
    })
  } catch (e) {
    console.error(`error: ${e.message}`)
    db.close()
  }
}())

module.exports = {
  UserModel: {
    async add (user) {
      return userCollection.insertOne(user)
    },
    async get ({ name }) {
      return userCollection.findOne({ name })
    },
    async delete ({ name }) {
      return Promise.all([
        postCollection.deleteMany({
          author: name,
        }),
        userCollection.deleteOne({ name }),
      ])
    },
  },
  PostModel: {
    async add (post) {
      return postCollection.insertOne(post)
    },
    async get (author) {
      const query = author ? { author } : {}
      const posts = await postCollection.find(query).toArray()
      const promises = posts.map((post) => {
        post.birth = post._id.getTimestamp()
        // 在json化时会自动调用。这里显式这个过程
        post.id = post._id.toHexString()
        delete post._id
        return new Promise(async (resolve) => {
          const au = await userCollection.findOne({
            name: post.author,
          })
          delete au.password
          delete au._id
          post.author = au
          resolve(post)
        })
      })
      return Promise.all(promises)
    },
    async delete ({ id }) {
      return postCollection.deleteOne({ _id: new ObjectID(id) })
    },
    async update (post) {
      const _id = new ObjectID(post.id)
      delete post.id
      return postCollection.findAndModify({
        _id,
      }, [], {
        $set: post,
      })
    },
  },
}
