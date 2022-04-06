# Exam Portal (Frontend)
Use `npm start` to run the project

## REGISTER ADMIN: `{base_url}/setAdmin`
Create administrator for the exam with following credentials
1. Roll Number: `portal0851@csi`
2. Password: `password-check`

## EMAIL VERIFICATION: `{base_url}/verifyEmail`
1. Takes in **emailId** and send an OTP to the respective Email Id
2. This OTP is only valid for 5min
3. This will then redirect you to the signup page

## SIGNUP: `{base_url}/signUp`
1. **Name**: Takes in the name of the user
2. **Student Number**: Takes in a 6 digit number
3. **Mobile Number**: Takes in a 10 digit valid mobile number
4. **Roll Number**: Takes in a 10 digit roll number
5. **Email ID**: Takes in the Email ID verified at the previous step
6. **OTP**: OTP recieved
7. **YEAR**: Year of Study
8. **Branch**: Respective Branch of the student
9. **Residency**: Has to pich from being a hosteler or day-scholar

## LOGIN: `{base_url}/logIn`
1. **Roll Number**: Filled at the time of signup
2. **Password**: It is the combination of *mobile number* and *roll number* separated by an *@*

For eg: If your **roll number** was *1234567890* and **mobile number** was *9876543210*
Then your password comes out to be `9876543210@1234567890`
