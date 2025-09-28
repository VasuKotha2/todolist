// Template for AWS DynamoDB persistence. Fill AWS SDK config and table names.
// This file intentionally left as a template; memory store used by default.


/*
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const TABLE = process.env.TODOS_TABLE || 'todos';


async function listTodos() {
const res = await dynamo.scan({ TableName: TABLE }).promise();
return res.Items || [];
}


async function createTodo(todo) {
await dynamo.put({ TableName: TABLE, Item: todo }).promise();
return todo;
}


module.exports = { listTodos, createTodo };
*/