# JOBS API
### Register Route
- Validate - name, email, password - with mongoose
- Hash password (with bcryptjs)
- Create token
- Send response with token

### Login User
- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send response with token