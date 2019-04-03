const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const Note = require('../models/note');

const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
  	id: { type: GraphQLID },
  	name: { type: GraphQLString },
  	genre: { type: GraphQLString },
  	author: {
  	  type: AuthorType,
  	  resolve(parent, args) {
  	  	return Author.findById(parent.authorId);
  	  }
  	}
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt  },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({authorId: parent.id})
      }
    }
  })
});

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString  },
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
  	book: { 
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
      	return Book.findById(args.id);
      }
  	},
  	author: {
  	  type: AuthorType,
  	  args: { id: {type: GraphQLID } },
  	  resolve(parent, args){ 
  	  	return Author.findById(args.id);
  	  }
  	},
  	books: {
  	  type: new GraphQLList(BookType),
  	  resolve(parent) {
  	  	return Book.find({});
  	  }
  	},
  	authors: {
  	  type: new GraphQLList(AuthorType),
  	  resolve(parent) {
  	  	return Author.find({});
  	  }
  	},
    note: {
      type: NoteType,
      args: { id: {type: GraphQLID }},
      resolve(parent,args){
        return Note.findById(args.id);
      }
    },
    notes: {
      type: new GraphQLList(NoteType),
      resolve(parent) {
        return Note.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addNote: {
      type: NoteType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let note = new Note({
          title: args.title,
          description: args.description
        });
        console.log("Has been added:", args);
        return note.save();
      }
    },
  	addAuthor: {
  	  type: AuthorType,
  	  args: {
  	  	name: { type: new GraphQLNonNull(GraphQLString) },
  	  	age: { type: new GraphQLNonNull(GraphQLInt) }
  	  },
  	  resolve(parent, args) {
  	  	let author = new Author({
  	  	  name: args.name,
  	  	  age: args.age
  	  	});
  	  	return author.save();
  	  }
  	},
  	addBook: {
  	  type: BookType,
  	  args: {
  	  	name: { type: new GraphQLNonNull(GraphQLString) },
  	  	genre: { type: new GraphQLNonNull(GraphQLString) },
  	  	authorId: { type: new GraphQLNonNull(GraphQLID) }
  	  },
  	  resolve(parent, args) {
  	  	let book = new Book({
  	  	  name: args.name,
  	  	  genre: args.genre,
  	  	  authorId: args.authorId
  	  	});
  	  	return book.save();
  	  }
  	},
    removeNote: {
      type: NoteType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) }
      },

      resolve(parent, args) {
        console.log("Has been removed:", args);
        return Note.remove({title: args.title});
      } 
    },
  	removeBook: {
  	  type: BookType,
  	  args: { 
  	  	name: { type: new GraphQLNonNull(GraphQLString) }
  	  },
  	  resolve(parent, args) {
  	  	return Book.remove({name: args.name});
  	  }
  	},
  	removeAuthor: {
  	  type: AuthorType,
  	  args: {
  	  	name: { type: new GraphQLNonNull(GraphQLString) }
  	  },
  	  resolve(parent, args) {
  	  	return Author.remove({name: args.name});
  	  }
  	},
    updateNote: {
      type: NoteType,
      args: {
        currentTitle: { type: new GraphQLNonNull(GraphQLString) },
        newTitle: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        console.log("Has been updated:", args);
        return Note.updateOne({ title: args.currentTitle }, { 
          $set: { 
            title: args.newTitle,
            description: args.description
          }}
        )
      }
    },
    updateAuthor: {
      type: AuthorType,
      args: {
        currentName: { type: new GraphQLNonNull(GraphQLString) },
        newName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return Author.updateOne({ name: args.currentName }, 
          { $set: { 
            name: args.newName,
            age: args.age 
          } }
        );
      }
    },
    updateBook: {
      type: BookType,
      args: {
        currentName: { type: new GraphQLNonNull(GraphQLString) },
        newName: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Book.updateOne({ name: args.currentName }, 
          { $set: { 
            name: args.newName,
            genre: args.genre,
            authorId: args.authorId 
          } }
        );
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
