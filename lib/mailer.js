const sendEmail = (res, mailOptions, email, password, message, mailer) => {

    mailer.createTestAccount((err, account) => {
        const transporter = mailer.createTransport({
            service: 'Gmail',
            secure: true, 
            auth: { user: email, pass: password }
        });
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.send(error);
            } else {
                return res.status(200).send({ message });
            } 
        });
    });
}

export default sendEmail;