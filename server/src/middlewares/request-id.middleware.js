import { v4 as uuidv4 } from 'uuid'

const requestIdAttach = (req, res, next) => {
    req.id = req.headers['x-request-id'] || uuidv4()
    res.setHeader('x-request-id', req.id)
    next()
}

export default requestIdAttach
