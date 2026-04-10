import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params;
    const { password } = await request.json();

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Senha deve ter pelo menos 8 caracteres" }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.used || resetToken.expires < new Date()) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      });
      await tx.user.updateMany({
        where: { email: resetToken.email },
        data: { passwordHash: hashedPassword },
      });
    });

    return NextResponse.json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
