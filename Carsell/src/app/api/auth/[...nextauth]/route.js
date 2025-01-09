import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/libs/db";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials) {
        const userFound = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!userFound) throw new Error("El usuario no existe");

        const matchPassword = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!matchPassword) throw new Error("Contraseña incorrecta");

        return {
          id: userFound.id,
          name: userFound.username,
          email: userFound.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Almacenamos el ID en el token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      if (!session) {
        console.log("Ningun usuario tiene la sesion iniciada");
      } else console.log("Datos de la sesion del usuario:", token); // Pasamos el ID del token a la sesión
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
