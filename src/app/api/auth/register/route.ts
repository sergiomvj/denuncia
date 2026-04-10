import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { validatePassword } from "@/lib/security"

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    // Validar força da senha conforme política FBR
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: `Senha inválida: ${passwordValidation.message}` },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.account.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já está em uso" },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar conta e perfil em transação
    const user = await prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          email,
          password: hashedPassword,
        }
      })

      const profile = await tx.profile.create({
        data: {
          account_id: account.account_id,
          first_name: firstName || null,
          last_name: lastName || null,
        }
      })

      return { ...account, profile }
    })

    return NextResponse.json(
      { 
        message: "Conta criada com sucesso",
        userId: user.account_id
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Erro no registro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
