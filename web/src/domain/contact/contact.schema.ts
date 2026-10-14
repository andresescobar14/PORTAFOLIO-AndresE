import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Escribe al menos 2 caracteres.').max(80, 'Máximo 80 caracteres.').regex(/^[^\r\n]+$/, 'El nombre debe estar en una línea.'),
  email: z.string().trim().max(254).pipe(z.email('Escribe un correo válido.')),
  message: z.string().trim().min(20, 'Cuéntame un poco más: al menos 20 caracteres.').max(3000, 'Máximo 3000 caracteres.'),
  website: z.string().max(200).default(''),
});
