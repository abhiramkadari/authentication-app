import { connectionObj } from "../config/dB";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET:any = process.env.SECRET_KEY;

export const signUpUser = async(domainName:string, payload:any)=>{

    const isEmailAllReadyExist = await connectionObj.db(`sample_${domainName}_details_db`)
    .collection("users").findOne( {"email": payload.email} );

    console.log('isEmailAllReadyExistisEmailAllReadyExist',isEmailAllReadyExist)

    if (isEmailAllReadyExist != null || isEmailAllReadyExist != undefined) {
        return ({
            status: 400,
        });
    }else{
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const token = jwt.sign({ email: payload.email }, SECRET);

        const userDetails = {
            ...payload,
            password: hashedPassword,
            token,
        };

        await connectionObj.db(`sample_${domainName}_details_db`)
        .collection("users")
        .insertOne(userDetails);
        return ({
            status: 200,
        });
    }
    
}

export const loginUser = async(domainName:string, payload:any)=>{
    const user = await connectionObj.db(`sample_${domainName}_details_db`)
    .collection("users").findOne({ "email": payload.email });

    if (!user) {
        return ({
            status: 400,
            message: 'User Not Registered',
        });
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordValid) {
        return ({
            status: 400,
            message: 'Invalid email or password',
        });
    }

    try {
        jwt.verify(user.token, SECRET);
        return ({
            status: 200,
            token: user.token,
        });
    } catch (error) {
        return ({
            status: 401,
            message: 'Invalid token',
        });
    }
}