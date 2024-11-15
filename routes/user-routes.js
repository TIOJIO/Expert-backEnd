const express = require('express');
const router = express.Router();
const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const mongoose = require('mongoose');



const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'doris2@ethereal.email',
    pass: '3WgFvR8JZXbJJW5rMw'
  }
});



router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(email);


  const resetToken = "GENERATE_RESET_TOKEN_HERE";
  const resetPasswordUrl = `http://localhost:3011/metronic8/react/demo1/auth/SetPassword/${email}`;


  let mailOptions = {
    from: '"Expéditeur" <info@ethereal.email>',
    to: 'doris2@ethereal.email',
    subject: 'Reset Password Link',
    text: `Please click on the following link to reset your password: ${resetPasswordUrl}`,
    html: `<p>Please click on the following link to reset your password: <a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>`,
  };



  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error sending email' });
    } else {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // URL pour visualiser l'e-mail sur Ethereal
      return res.status(200).json({ message: 'Email sent successfully', preview: nodemailer.getTestMessageUrl(info) });
    }
  });
});


router.put('/change-password/:email', async (req, res) => {
  const { email } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
});


router.put('/ban/:id', async (req, res) => {
  try {
    const userId = req.params.id;


    const updatedUser = await User.findByIdAndUpdate(userId, { status: 'banned' }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User has been banned successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/activate/:id', async (req, res) => {
  try {
    const userId = req.params.id;


    const updatedUser = await User.findByIdAndUpdate(userId, { status: 'active' }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User has been activated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});







router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
  }
});

router.put('/update/:firstname', async (req, res) => {
  try {
    const { firstname } = req.params; // Récupère le prénom de l'utilisateur depuis les paramètres de l'URL
    const { first_name, last_name, email, password } = req.body; // Récupère les champs du body

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ first_name: firstname }); // Utiliser findOne pour récupérer un seul utilisateur
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Mise à jour des informations de l'utilisateur
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;

    // Si le mot de passe doit être mis à jour, le hacher
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    // Sauvegarder les nouvelles informations de l'utilisateur
    await user.save(); // Maintenant user est une instance du modèle User

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






router.post('/register', async (req, res) => {
  try {

    const { email, first_name, last_name, password, password_confirmation } = req.body;


    if (!email || !first_name || !last_name || !password || !password_confirmation) {
      return res.status(400).json({ error: 'All registration fields are required' });
    }


    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }


    if (password !== password_confirmation) {
      return res.status(400).json({ error: 'Password and confirmation do not match' });
    }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ email, first_name, last_name, password: hashedPassword });


    user.role = 'creator';
    user.status = 'active';

    await user.save();

    // Generate JWT token
    const api_token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', api_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

















async function findUserByEmail(email) {
  return await User.findOne({ email: email });
}


function generateSessionTokenForUser(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    'your-secret-key',
    {
      expiresIn: '1h',
    }
  );
}



const REDIRECT_URI = "http://localhost:3011"; // Remplacez par votre URI de redirection réelle













router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }


    if (user.status === 'banned') {
      return res.status(403).json({ error: 'You are banned' });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }


    const api_token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      'your-secret-key',
      {
        expiresIn: '1h',
      }
    );


    res.status(200).json({ message: 'Sign-in successful', api_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/verify_token', async (req, res) => {
  try {
    const { api_token } = req.body;


    if (!api_token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify the token
    jwt.verify(api_token, 'your-secret-key', async (err, decoded) => {
      if (err) {
        console.error("token not valid");
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Fetch user data based on the decoded token
      const user = await User.findById(decoded.userId);

      if (!user) {
        console.log("User not found")
        return res.status(404).json({ error: 'User not found' });

      }

      // Return user data
      res.status(200).json(user);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;


