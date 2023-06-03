import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import Jwt from "jsonwebtoken";

export const registerController = async (req, res) => { 
    try {
        const {name, email, password, phone, address, terms, answer} = req.body;
        //Validation 
        if(!name){
            return res.send({message: "Name is Required"});
        }
        if(!email){
            return res.send({message: "Email is Required"});
        }
        if(!password){
            return res.send({message: "Password is Required"});
        }
        if(!phone){
            return res.send({message: "Phone is Required"});
        }
        if(!address){
            return res.send({message: "Address is Required"});
        }
        if(!answer){
            return res.send({message: "Answer is Required"});
        }
        if(!terms){
            return res.send({message: "You are not agree with Terms & Conditon"});
        }

        //check User
        const existingUser = await userModel.findOne({ email })
        //Existing User
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: "Already Register Please Login",
            })
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({
            name,
            email, 
            phone,
            address, 
            password: hashedPassword,
            terms,
            answer
        }).save(); 

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error,
        })
    }
};

// POST Login

export const loginController = async (req, res) => {
    try{
        const {email, password} = req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }

        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Email is not registerd"
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message: "Invalid Password"
            })
        }
        //token
        const token = await Jwt.sign({_id: user._id}, process.env.JWT_SECRET,{
            expiresIn: "7d",
            });
            res.status(200).send({
                success: true,
                message: "Login Sucessfully",
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                },
                token,
            })
    } catch (error) {
        console.log(error) ; 
            res.status(500).send ({
                success: false,
                message: "Error in login",
                error
          })
    }
    
}

//forgot Password Controller
export const forgotPasswordController = async (req, res) => {
    try {
        const {email, answer, newPassword, confirmPassword} = req.body;
        if(!email)
            res.status(400).send({message: 'Email is required'});

        if(!answer)
            res.status(400).send({message: 'Answer is required'});

        if(!newPassword)
            res.status(400).send({message: 'New Password is required'});

        if(!confirmPassword)
            res.status(400).send({message: 'Confirm Password is required'});
        
        if(newPassword != confirmPassword){
            res.status(400).send({message: 'New Password and Confirm Password does not match'});
        }
        //check
        const user = await userModel.findOne({email, answer})
        console.log(user)
        //validation
        if(!user){
            return res.status(404).send({
                success: false,
                messgae: 'Wrong Email or Answer'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate( user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully',
        })
    } catch (error) {
        console.log(500).send({
            success: false,
            message: 'Something went weong',
            error
        })
    }
}

//test controller
export const testController = (req, res) => {
    res.send('protected Route');
}

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        console.log("User Id Backend", req.user._id);
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error while update",
            error
        })
    }
}