import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import transporter from "../config/emailConfig.js";


export const userRegistration = async (req, res) => {
  const { name, email, password, tc } = req.body;
  console.log('req.body', req.body)
  try {
    // Check if all required fields are present
    if (
      !name ||
      !email ||
      !password ||
      tc === undefined
    ) {
      return res.status(400).json({
        status: "Failed",
        message: "All fields are required",
      });
    }

    // Check if the user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        status: "Failed",
        message: "User already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      tc,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    const User = await UserModel.findOne({ email });
    const token = JWT.sign({ userID: User._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5d",
    });

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
      token: token,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not registered",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    // Generate a JWT token
    const token = JWT.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5d",
    });

    // Respond with success
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred during login",
    });
  }
};


export const changeUserPasssword = async (req, res) => {
  try {
    const { old_password, password, password_confirmation } = req.body;

    // Check if all required fields are provided
    if (!old_password || !password || !password_confirmation) {
      return res.status(400).send({
        status: "failed",
        message: "All fields (old_password, password, password_confirmation) are required",
      });
    }

    // Check if the new password and confirmation match
    if (password !== password_confirmation) {
      return res.status(400).send({
        status: "failed",
        message: "Password and Confirm Password do not match",
      });
    }

    // Ensure req.user is set by the middleware
    if (!req.user || !req.user._id) {
      return res.status(401).send({
        status: "failed",
        message: "Unauthorized. User not found.",
      });
    }

    // Fetch the user from the database
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        status: "failed",
        message: "User not found",
      });
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        status: "failed",
        message: "Old password is incorrect",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    await UserModel.findByIdAndUpdate(req.user._id, {
      $set: { password: newHashPassword },
    });

    res.status(200).send({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).send({
      status: "failed",
      message: "An error occurred while changing the password",
    });
  }
};

export const LoggedUser = async(req, res)=>{
  res.send({'user': req.user})
  console.log('user', req.user)
}
export const userResetPassword = async (req, res) => {
  const { email } = req.body;

  // Check if email is provided
  if (email) {
    // Find the user by email
    const user = await UserModel.findOne({ email: email });
    console.log(user);

    if (user) {
      // Generate the secret for the JWT token
      const Secret = user._id + process.env.JWT_SECRET_KEY;

      // Create a reset token with expiration
      const token = JWT.sign({ userID: user._id }, Secret, { expiresIn: '15m' });

      // Construct the reset link
      const Link = `http://localhost:5173/reset-password/${user._id}/${token}`;
      console.log(Link);

      try {
        // Send the password reset email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Reset Password",
          html: `<a href=${Link}>Click this link to reset your password</a>`,
        });

        // Respond with success message
        return res.status(200).send({
          status: "success",
          message: "Email sent successfully. Please check your inbox.",
          info: info,
        });

      } catch (error) {
        console.error("Error sending email:", error.message);

        // Respond with an error message
        return res.status(500).send({
          status: "failed",
          message: "Failed to send email. Please try again later.",
        });
      }
    } else {
      // If user not found
      return res.status(404).send({
        status: "failed",
        message: "Email does not exist",
      });
    }
  } else {
    // If email field is not provided
    return res.status(400).send({
      status: "failed",
      message: "Email field is required",
    });
  }
};

export const passwordResetlink = async (req, res) => {
  const { old_password, password, password_confirmation } = req.body;
  const { id, token } = req.params;

  try {
    // Find the user by ID
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).send({
        status: "failed",
        message: "User not found",
      });
    }

    // Generate the secret for verifying the token
    const newSecret = user._id + process.env.JWT_SECRET_KEY;

    // Verify the token
    JWT.verify(token, newSecret);

    // Validate input fields
    if (!old_password ||!password || !password_confirmation) {
      return res.status(400).send({
        status: "failed",
        message: "All fields are required",
      });
    }

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        status: "failed",
        message: "Old password is incorrect",
      });
    }

    if (password !== password_confirmation) {
      return res.status(400).send({
        status: "failed",
        message: "Password and confirm password do not match",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    // Respond with success
    return res.status(200).send({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in password reset:", error.message);
    return res.status(400).send({
      status: "failed",
      message: "Invalid token or error occurred",
    });
  }
};
