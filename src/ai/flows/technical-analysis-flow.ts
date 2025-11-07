
'use server';
/**
 * @fileOverview An AI agent for technical analysis of stock charts.
 *
 * - technicalAnalysis - A function that analyzes a candlestick chart image.
 * - TechnicalAnalysisInput - The input type for the technicalAnalysis function.
 * - TechnicalAnalysisOutput - The return type for the technicalAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TechnicalAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a candlestick chart, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TechnicalAnalysisInput = z.infer<typeof TechnicalAnalysisInputSchema>;

const KeyLevelSchema = z.object({
  level: z.string().describe("El nivel de precio (e.g., '~€150.50')."),
  reason: z.string().describe("La razón por la que este nivel es importante."),
});

const TrendSchema = z.object({
  shortTerm: z.string().describe("La tendencia a corto plazo (e.g., Alcista, Bajista, Lateral)."),
  mediumTerm: z.string().describe("La tendencia a medio plazo."),
  longTerm: z.string().describe("La tendencia a largo plazo."),
});

const RsiSchema = z.object({
  value: z.number().min(0).max(100).describe("El valor numérico del RSI (0-100). Si no es visible, estima un valor y establece isVisible a false."),
  status: z.enum(["Sobrecompra", "Sobreventa", "Neutral"]).describe("El estado del RSI."),
  isVisible: z.boolean().describe("True si el indicador RSI es claramente visible en el gráfico, de lo contrario false."),
});

const MacdSchema = z.object({
  status: z.enum(["Cruce Alcista", "Cruce Bajista", "Sin Cruce Claro", "N/A"]).describe("El estado del MACD (e.g., Cruce Alcista, Cruce Bajista)."),
  comment: z.string().describe("Un breve comentario sobre el MACD."),
  isVisible: z.boolean().describe("True si el indicador MACD es claramente visible en el gráfico, de lo contrario false."),
});


const TechnicalAnalysisOutputSchema = z.object({
  analysis: z.object({
    generalTrend: z.string().describe('Describe la tendencia general (e.g., alcista, bajista o lateral).'),
    patterns: z.string().describe('Identifica y nombra patrones de velas relevantes (e.g., martillo, doji) y explica sus implicaciones.'),
    signals: z.string().describe('Destaca otras señales técnicas si existen (e.g., rupturas, formaciones chartistas como triángulos, etc.).'),
    conclusion: z.string().describe('Proporciona una interpretación de lo que el análisis indica para el posible comportamiento futuro del precio.'),
  }),
  summary: z.object({
    trends: TrendSchema,
    supports: z.array(KeyLevelSchema).describe("Una lista de niveles de soporte clave."),
    resistances: z.array(KeyLevelSchema).describe("Una lista de niveles de resistencia clave."),
  }),
  indicators: z.object({
    rsi: RsiSchema,
    macd: MacdSchema,
  })
});
export type TechnicalAnalysisOutput = z.infer<typeof TechnicalAnalysisOutputSchema>;


const prompt = ai.definePrompt({
  name: 'technicalAnalysisPrompt',
  input: { schema: TechnicalAnalysisInputSchema },
  output: { schema: TechnicalAnalysisOutputSchema },
  prompt: `
    Actúa como un agente financiero experto en análisis técnico de mercados bursátiles. Tu respuesta DEBE ser exclusivamente en español.
    Recibirás una imagen de un gráfico de velas. Tu tarea es realizar un análisis técnico completo y estructurado.

    La imagen puede contener el gráfico principal de velas y también indicadores como RSI y MACD. Si estos indicadores no son visibles, debes indicarlo.

    Tu análisis debe incluir:
    1.  **Análisis Detallado (analysis)**:
        -   **Tendencia General (generalTrend)**: Describe la tendencia general (alcista, bajista o lateral).
        -   **Patrones de Velas (patterns)**: Identifica y nombra patrones de velas relevantes (e.g., martillo, estrella fugaz, envolvente, doji) y explica su posible implicancia.
        -   **Otras Señales Técnicas (signals)**: Si existen, resalta otras señales (e.g., rupturas de líneas de tendencia, formaciones chartistas como triángulos, hombro-cabeza-hombro, canales).
        -   **Conclusión (conclusion)**: Finaliza con una interpretación de lo que indica el análisis para el posible comportamiento futuro del precio.

    2.  **Resumen y Niveles Clave (summary)**:
        -   **Tendencias (trends)**: Proporciona un resumen de la tendencia a corto, medio y largo plazo.
        -   **Soportes (supports)**: Señala 1-3 niveles clave de soporte, indicando el precio aproximado y por qué es relevante (e.g., mínimo anterior, media móvil).
        -   **Resistencias (resistances)**: Señala 1-3 niveles clave de resistencia.

    3.  **Análisis de Indicadores (indicators)**:
        -   **RSI**: Si el indicador RSI es visible, determina su valor numérico (0-100) y su estado (Sobrecompra >70, Sobreventa <30, Neutral 30-70). Si no es visible, establece isVisible a false y estima un valor razonable basado en la acción del precio.
        -   **MACD**: Si el indicador MACD es visible, determina si hay un cruce alcista (línea MACD cruza por encima de la señal) o bajista. Si no es visible, establece isVisible a false y status a "N/A".

    Asegúrate de que toda la salida esté estructurada según el esquema JSON proporcionado y completamente en español.

    Chart Image: {{media url=photoDataUri}}
  `,
});

const technicalAnalysisFlow = ai.defineFlow(
  {
    name: 'technicalAnalysisFlow',
    inputSchema: TechnicalAnalysisInputSchema,
    outputSchema: TechnicalAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a structured output.");
    }
    return output;
  }
);


export async function technicalAnalysis(input: TechnicalAnalysisInput): Promise<TechnicalAnalysisOutput> {
  return technicalAnalysisFlow(input);
}
