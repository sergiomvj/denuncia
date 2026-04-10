// Política de senha FBR: 32 caracteres, letras, números e símbolos
export function validatePassword(password: string): { valid: boolean; message?: string } {
  // No ambiente dev, permitir qualquer senha
  if (process.env.NODE_ENV === 'development') {
    return { valid: true }
  }

  if (password.length !== 32) {
    return { valid: false, message: "A senha deve ter exatamente 32 caracteres" }
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos uma letra" }
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos um número" }
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos um símbolo especial" }
  }
  
  return { valid: true }
}

// Função auxiliar para gerar senha segura FBR
export function generateSecurePassword(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{};:\'",.<>/?'
  
  const allChars = lowercase + uppercase + numbers + symbols
  let password = ''
  
  // Garantir pelo menos um de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Completar até 32 caracteres
  for (let i = password.length; i < 32; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Embaralhar a senha
  return password.split('').sort(() => Math.random() - 0.5).join('')
}
