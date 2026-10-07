const asyncHandler = (requestHandler) => {
     (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((error)=> next(error))
    }
}

export default asyncHandler

// const asyncHandler = () =>{}
// const asyncHandler = (func) => () =>{}
// const asyncHandler = (func) => async () =>{}

// 1st approach is the best one because it is a higher order 
// function that takes a function as an argument and returns a 
// new function that wraps the original function in a try-catch block. 
// This allows for error handling in asynchronous functions
//  without having to write repetitive try-catch blocks in each 
// route handler.


// const asyncHandler = (fn) => async (req, res, next) => {
//  try{
//   await fn(req, res, next)
//  }catch(error){
//     res.status(  error.code|| 500).json({ success: false,
//          message: error.message })
//  }
// }

// export {asyncHandler} 

