

const allowedPreconditionsForNumber = [
    'NOT_NULL',
    'LESS_THAN',
    'LESS_THAN_OR_EQUAL',
    'GREATER_THAN',
    'GREATER_THAN_OR_EQUAL',
    'EQUAL',
    'NOT_EQUAL'
],

const allowedPreconditionsForString = [
    'NOT_NULL',
    'EQUAL',
    'NOT_EQUAL'
]

module.exports = { allowedPreconditionsForNumber, allowedPreconditionsForString }