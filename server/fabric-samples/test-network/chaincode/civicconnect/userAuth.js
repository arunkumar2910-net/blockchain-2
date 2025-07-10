'use strict';

const { Contract } = require('fabric-contract-api');

class UserAuthContract extends Contract {
    // Register a new user
    async registerUser(ctx, userId, firstName, lastName, email, role) {
        const userKey = ctx.stub.createCompositeKey('User', [userId]);
        const exists = await this.userExists(ctx, userId);
        if (exists) {
            throw new Error(`User with ID ${userId} already exists`);
        }

        const user = {
            userId,
            firstName,
            lastName,
            email,
            role: (role === 'employee' ? 'employee' : 'user'),
            isActive: true,
            lastLogin: '',
            resetPasswordToken: '',
            resetPasswordExpires: ''
        };

        await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    // Retrieve user data by userId
    async getUserById(ctx, userId) {
        const userKey = ctx.stub.createCompositeKey('User', [userId]);
        const userBytes = await ctx.stub.getState(userKey);
        if (!userBytes || userBytes.length === 0) {
            throw new Error(`User with ID ${userId} does not exist`);
        }
        return userBytes.toString();
    }

    // Check if user exists
    async userExists(ctx, userId) {
        const userKey = ctx.stub.createCompositeKey('User', [userId]);
        const userBytes = await ctx.stub.getState(userKey);
        return (!!userBytes && userBytes.length > 0);
    }
}

module.exports = UserAuthContract;