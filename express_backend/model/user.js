import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    personalInfo: {
      firstName: { type: String, required: true, minlength: 2, maxlength: 30 },
      lastName: { type: String, required: true, minlength: 2, maxlength: 30 },
      dateOfBirth: { type: Date, required: true },
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer-not-to-say"],
      },
      nationality: { type: String, maxlength: 50 },
      profileImage: { type: String }, // URL to profile image
    },

    // Contact Information
    contactInfo: {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
          // Basic RFC 5322 compliant regex for email
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please enter a valid email address",
        ],
      },
      phone: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^[\+]?[1-9][\d]{0,15}$/.test(v);
          },
          message: "Invalid phone number format",
        },
      },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true, default: "USA" },
        zipCode: { type: String, required: true },
      },
    },

    // Authentication
    authentication: {
      password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
          validator: function (v) {
            // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
              v
            );
          },
          message:
            "Password must be at least 8 characters with uppercase, lowercase, number and special character",
        },
      },
      lastLogin: { type: Date },
      loginAttempts: { type: Number, default: 0, max: 5 },
      lockUntil: { type: Date },
      passwordResetToken: String,
      passwordResetExpires: Date,
      emailVerified: { type: Boolean, default: false },
      emailVerificationToken: String,
      twoFactorEnabled: { type: Boolean, default: false },
      twoFactorSecret: String,
    },

    // Role & Permissions
    role: {
      type: String,
      enum: ["member", "librarian", "admin", "super_admin"],
      default: "member",
    },
    permissions: [
      {
        module: {
          type: String,
          enum: ["books", "users", "transactions", "reports", "settings"],
        },
        actions: [
          { type: String, enum: ["create", "read", "update", "delete"] },
        ],
      },
    ],

    // Academic Information (for students/faculty)
    academicInfo: {
      institution: String,
      studentId: String,
      course: String,
      year: { type: Number, min: 1, max: 10 },
      department: String,
      cgpa: { type: Number, min: 0, max: 10 },
      enrollmentDate: Date,
      graduationDate: Date,
    },

    // Financial Information
    financialInfo: {
      totalFines: { type: Number, default: 0 },
      paidFines: { type: Number, default: 0 },
      outstandingFines: { type: Number, default: 0 },
      securityDeposit: { type: Number, default: 0 },
      paymentHistory: [
        {
          amount: Number,
          type: {
            type: String,
            enum: ["fine", "membership", "deposit", "other"],
          },
          date: { type: Date, default: Date.now },
          method: {
            type: String,
            enum: ["cash", "card", "online", "bank_transfer"],
          },
          transactionId: String,
          status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "completed",
          },
        },
      ],
    },

    // System Information
    systemInfo: {
      isActive: { type: Boolean, default: true },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      notes: [
        {
          text: String,
          addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          addedAt: { type: Date, default: Date.now },
          category: {
            type: String,
            enum: ["general", "disciplinary", "academic", "financial"],
          },
        },
      ],
      tags: [String], // For easy categorization and search
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.authentication.password;
        delete ret.authentication.passwordResetToken;
        delete ret.authentication.twoFactorSecret;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    personalInfo: {
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      dateOfBirth: Joi.date().required(),
    },
    contactInfo: {
      address: Joi.object({
        street: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        zipCode: Joi.string().required(),
      }).required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
        .required()
        .messages({
          "string.pattern.base": "Invalid phone number format",
          "string.empty": "Phone number is required",
        }),
    },
    authentication: {
      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must be at least 8 characters with uppercase, lowercase, number and special character",
          "string.empty": "Password is required",
        }),
    },
  });
  return schema.validate(user);
}
export { User, userSchema, validateUser };
