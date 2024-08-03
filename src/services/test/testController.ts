import { inspect } from "util";
import { connectionObj } from "../../config/dB";
// import imaps from 'imap-simple'

import Imap from 'node-imap';


// export const testEmailService = async()=>{
//     var imap = new Imap({
//         user: 'abhiramkadari2000@outlook.com',
//         password: 'Abhiram@0212',
//         host: 'outlook.office365.com',
//         port: 993,
//         tls: true,
//         connTimeout: 30000, // 30 seconds
//         authTimeout: 30000
//       });



//     function openInbox(cb:any) {
//         imap.openBox("INBOX",true,cb);
//     }

//     function isPrintable(str:any) {
//     return /^[\x20-\x7E\s]*$/.test(str);
//     }

//     imap.once("ready",function(){
//         openInbox(function(err:any,box:any){
//             if(err) throw err;
//             let f = imap.seq.fetch(`${box.messages.total-2}:${box.messages.total}`,{
//             bodies:["HEADER.FIELDS (FROM TO SUBJECT DATE)","1"],
//             struct:true
//             });
//             f.on("message",function(msg,seqno){
//             console.log(`Message #%d`,seqno);
//             let prefix =`("`+seqno+`)`;
//             msg.on("body",function(stream,info){
//                 let buffer = "";
//                 stream.on ("data",function(chunk){
//                 buffer+= chunk.toString("utf8");
//                 });
//                 stream.once("end",function(){
//                 if(info.which === "1") {
//                     let decodedBody = "";
//                     decodedBody = Buffer.from(buffer,"base64").toString("utf8");
//                     if(isPrintable(decodedBody)) {
//                     console.log(prefix + 'Parsed body: %s', decodedBody);
//                     }
//                     else
//                     console.log(prefix + 'Parsed body: %s', buffer);
//                 }
//                 else
//                 console.log(prefix+`Parsed header: %s`, inspect(Imap.parseHeader(buffer)));
//                 });
//             });
//             });
//             f.once("error",function(err){
//             console.log("Fetch error: "+err);
//             });
//             f.once("end",function(){
//             console.log("Done fetching all messages!");
//             imap.end();
//             });
//         });
//     });
      
      
//     imap.once("end",function(){
//     console.log("Connection ended");
//     });
      
//     imap.connect();
// }

export const testEmailService = async()=>{
    var imap = new Imap({
        user: 'abhiramkadari2000@gmail.com',
        password: 'xfbs qhcl kwbf mfde',
        // password: 'Abhiram@0212',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        connTimeout: 30000, // 30 seconds
        authTimeout: 30000
      });



    function openInbox(cb:any) {
        imap.openBox("INBOX",true,cb);
    }

    function isPrintable(str:any) {
        return /^[\x20-\x7E\s]*$/.test(str);
    }

    imap.once("ready",function(){
        openInbox(function(err:any,box:any){
            if(err) throw err;

            let f = imap.seq.fetch(`${box.messages.total-2}:${box.messages.total}`,{
                bodies:["HEADER.FIELDS (FROM TO SUBJECT DATE)","1"],
                struct:true
            });

            f.on("message",function(msg,seqno){
                console.log(`Message #%d`,seqno);
                let prefix =`("`+seqno+`)`;
                msg.on("body",function(stream,info){
                    let buffer = "";

                    stream.on ("data",function(chunk){
                        buffer+= chunk.toString("utf8");
                    });

                    stream.once("end",function(){
                        if(info.which === "1") {
                            let decodedBody = "";
                            decodedBody = Buffer.from(buffer,"base64").toString("utf8");
                            if(isPrintable(decodedBody)) {
                                console.log(prefix + 'Parsed body: %s', decodedBody);
                            }
                            else{
                                console.log(prefix + 'Parsed body: %s', buffer);
                            }
                            
                        }else{
                            console.log(prefix+`Parsed header: %s`, inspect(Imap.parseHeader(buffer)));
                        }
                    });
                });
            });

            f.once("error",function(err){
                console.log("Fetch error: "+err);
            });

            f.once("end",function(){
                console.log("Done fetching all messages!");
                imap.end();
            });
        });
    });
      
      
    imap.once("end",function(){
        console.log("Connection ended");
    });
      
    imap.connect();
}



