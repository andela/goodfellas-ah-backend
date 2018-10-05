const sendEmail = (res, mailOptions, email, password, message, mailer) => {
  mailer.createTestAccount(() => {
    const transporter = mailer.createTransport({
      service: 'Gmail',
      secure: true,
      auth: { user: email, pass: password }
    });

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.send(error);
      }
      return res.status(200).send({ message });
    });
  });
};

export default sendEmail;
