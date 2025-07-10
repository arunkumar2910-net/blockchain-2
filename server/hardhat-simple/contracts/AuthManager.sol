// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuthManager {
    struct User {
        string firstName;
        string lastName;
        string email;
        string role;
        bool isActive;
        uint256 lastLogin;
        address userAddress;
    }

    mapping(address => User) public users;
    mapping(string => address) public emailToAddress;

    event UserRegistered(address indexed user, string email, string role);
    event UserLoggedIn(address indexed user, uint256 timestamp);
    event UserDeactivated(address indexed user);
    event UserReactivated(address indexed user);

    modifier onlyRegistered() {
        require(bytes(users[msg.sender].email).length != 0, "User not registered");
        _;
    }

    function register(
        string memory firstName,
        string memory lastName,
        string memory email,
        string memory role
    ) public {
        require(bytes(users[msg.sender].email).length == 0, "Already registered");
        require(emailToAddress[email] == address(0), "Email already in use");
        require(
            keccak256(bytes(role)) == keccak256(bytes("user")) ||
            keccak256(bytes(role)) == keccak256(bytes("employee")),
            "Invalid role"
        );

        users[msg.sender] = User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role,
            isActive: true,
            lastLogin: 0,
            userAddress: msg.sender
        });

        emailToAddress[email] = msg.sender;

        emit UserRegistered(msg.sender, email, role);
    }

    function login(string memory email) public onlyRegistered {
        require(
            keccak256(bytes(users[msg.sender].email)) == keccak256(bytes(email)),
            "Incorrect email"
        );
        require(users[msg.sender].isActive, "Account deactivated");

        users[msg.sender].lastLogin = block.timestamp;
        emit UserLoggedIn(msg.sender, block.timestamp);
    }

    function deactivate() public onlyRegistered {
        users[msg.sender].isActive = false;
        emit UserDeactivated(msg.sender);
    }

    function reactivate() public onlyRegistered {
        users[msg.sender].isActive = true;
        emit UserReactivated(msg.sender);
    }

    function getUser(address userAddr) public view returns (
        string memory, string memory, string memory, string memory, bool, uint256
    ) {
        User memory u = users[userAddr];
        return (u.firstName, u.lastName, u.email, u.role, u.isActive, u.lastLogin);
    }
}