import mongoose from 'mongoose';

const mailSchema = {
  regExp: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, // eslint-disable-line 
  suffix: ['study.hs-duesseldorf.de']
};

const passwordSchema = {
  regExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,32})/
};

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Bitte gebe Deinen Vornamen ein.'],
    min: [2, 'Dein Vorname ist zu kurz, bitte prüfe Deine Eingabe.'],
    max: [18, 'Dein Vorname ist zu lang, bitte prüfe Deine Eingabe.']
  },
  lastname: {
    type: String,
    required: [true, 'Bitte gebe Deinen Nachnamen ein.'],
    min: [2, 'Dein Nachname ist zu kurz, bitte prüfe Deine Eingabe.'],
    max: [25, 'Dein Nachname ist zu lang, bitte prüfe Deine Eingabe.']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Bitte verwende Deine gültige HSD E-Mail Adresse.'],
    validate: {
      validator: userMail => mailSchema.regExp.test(userMail) && mailSchema.suffix.some(suffix => new RegExp(`${suffix}$`).test(userMail.toLowerCase().replace(/\s/g, ''))),
      message: 'Bitte verwende Deine gültige HSD E-Mail Adresse.'
    }
  },
  password: {
    type: String,
    required: [true, 'Bitte gebe ein gültiges Passwort ein.'],
    validate: {
      validator: userPassword => passwordSchema.regExp.test(userPassword),
      message: 'Dein Passwort muss aus einem Klein-/Großbuchstaben, einer Zahl und einem Sonderzeichen (!@#%&) bestehen und acht bis 32 Zeichen lang sein.'
    }
  },
  settings: {
    type: Number,
    default: 0
  },
  authorization: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

userSchema.virtual('fullName').get(() => `${this.firstname} ${this.lastname}`);


const User = mongoose.model('users', userSchema);
const predefinedFields = {
  settings: 0,
  authorization: 0,
  active: true,
  created_at: Date.now()
};
export const createUser = async(newUser) => {
  try{
    const emailIsUnique = !(await User.find({ email: newUser.email })).length;
    if(emailIsUnique) {
      return new User(Object.assign(newUser, predefinedFields)).save();
    }
    const err = { errors: { email: { message: 'Unter der angegebenen E-Mail Adresse existiert bereits ein Zugang.' }}};
    throw err;
  }catch(err) {
    throw err;
  }
};
export const updateUser = updatedUser => User.update({ _id: updatedUser._id }, updatedUser);