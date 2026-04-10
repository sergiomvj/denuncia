import { validatePassword, generateSecurePassword } from './security'

describe('FBR Security Policy', () => {
  describe('validatePassword', () => {
    test('deve aceitar senha com 32 caracteres contendo letras, números e símbolos', () => {
      const password = 'Abc123!@#$%^&*()_+{}|:"<>?abcdefghijklmn'
      const result = validatePassword(password)
      expect(result.valid).toBe(true)
    })

    test('deve rejeitar senha com menos de 32 caracteres', () => {
      const password = 'Abc123!@#$'
      const result = validatePassword(password)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('exatamente 32 caracteres')
    })

    test('deve rejeitar senha sem letras', () => {
      const password = '1234567890!@#$%^&*()_+{}|:"<>?1234'
      const result = validatePassword(password)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('pelo menos uma letra')
    })

    test('deve rejeitar senha sem números', () => {
      const password = 'Abcdefgh!@#$%^&*()_+{}|:"<>?ABCDEFG'
      const result = validatePassword(password)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('pelo menos um número')
    })

    test('deve rejeitar senha sem símbolos', () => {
      const password = 'Abcdefgh1234567890ABCDEFGHIJKLMNOP'
      const result = validatePassword(password)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('pelo menos um símbolo especial')
    })
  })

  describe('generateSecurePassword', () => {
    test('deve gerar senha com 32 caracteres', () => {
      const password = generateSecurePassword()
      expect(password.length).toBe(32)
    })

    test('senha gerada deve passar na validação FBR', () => {
      const password = generateSecurePassword()
      const result = validatePassword(password)
      expect(result.valid).toBe(true)
    })
  })
})
