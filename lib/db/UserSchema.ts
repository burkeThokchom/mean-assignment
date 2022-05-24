import * as mongoose from "mongoose";
export const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
		address_line_1: {
			type: String
		},
		address_line_2: {
			type: String
		},
		city: {
			type: String
		},
		zipcode: {
			type: Number
		},
		state: {
			type: String
		},
	},
	contact: {
		type: [String]
	},
	eduProgress: {
		type: Array
	},
}, {timestamps: true});
