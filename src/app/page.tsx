
"use client"

import * as React from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, UploadCloud, ClipboardPaste, BrainCircuit, TrendingUp, TrendingDown, Minus, GanttChartSquare, CandlestickChart, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { technicalAnalysis, type TechnicalAnalysisOutput } from "@/ai/flows/technical-analysis-flow"
import { cn } from "@/lib/utils"

const RsiGauge = ({ value }: { value: number }) => {
  const getRotation = (v: number) => (v / 100) * 180;
  const rotation = getRotation(value);
  const status = value > 70 ? "Sobrecompra" : value < 30 ? "Sobreventa" : "Neutral";
  const colorClass = value > 70 ? "text-red-500" : value < 30 ? "text-yellow-500" : "text-green-500";
  
  return (
    <div className="relative flex flex-col items-center justify-center p-4 h-full">
      <div className="w-48 h-24 overflow-hidden">
        <div className="w-full h-[200%] relative">
          <div className="w-48 h-24 border-8 border-gray-200 dark:border-gray-700 rounded-t-full border-b-0"></div>
          <div
            className="absolute bottom-0 left-0 w-48 h-24 border-8 border-b-0 rounded-t-full"
            style={{
              borderImage: "linear-gradient(to right, #fde047, #22c55e, #ef4444) 1",
              borderImageSlice: 1,
            }}
          ></div>
        </div>
      </div>
      <div
        className="absolute bottom-16 w-1 h-14 bg-foreground origin-bottom transition-transform duration-500"
        style={{ transform: `rotate(${rotation - 90}deg)` }}
      ></div>
      <div className="absolute bottom-[4.5rem] w-4 h-4 bg-foreground rounded-full"></div>
      <div className="absolute top-[8rem] text-center">
        <div className="text-3xl font-bold">{value.toFixed(1)}</div>
        <div className={`text-lg font-semibold ${colorClass}`}>{status}</div>
      </div>
    </div>
  );
};


const MacdIndicator = ({ status, comment }: { status: TechnicalAnalysisOutput['indicators']['macd']['status'], comment: string }) => {
    let Icon;
    let colorClass;
    switch(status) {
        case "Cruce Alcista":
            Icon = TrendingUp;
            colorClass = "text-green-500";
            break;
        case "Cruce Bajista":
            Icon = TrendingDown;
            colorClass = "text-red-500";
            break;
        default:
            Icon = Minus;
            colorClass = "text-gray-500";
            break;
    }
    return (
        <div className="flex flex-col items-center justify-center gap-2 p-4 h-full">
             <Icon className={cn("h-16 w-16", colorClass)} />
             <p className={cn("text-lg font-semibold", colorClass)}>{status}</p>
             <p className="text-sm text-muted-foreground text-center">{comment}</p>
        </div>
    )
}

export default function TechnicalAnalysisPage() {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = React.useState<TechnicalAnalysisOutput | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }
  
  const processFile = (file: File) => {
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
      toast({
        variant: "destructive",
        title: "Error",
        description: "El archivo es demasiado grande. El límite es 4MB.",
      })
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      setAnalysisResult(null)
    }
    reader.readAsDataURL(file)
  }

  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if(file){
            processFile(file);
            toast({
                title: "Imagen Pegada",
                description: "La imagen se ha pegado correctamente desde el portapapeles.",
            })
        }
        break;
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, sube una imagen primero.",
      })
      return
    }
    setIsLoading(true)
    setAnalysisResult(null)
    try {
      const result = await technicalAnalysis({ photoDataUri: imagePreview })
      setAnalysisResult(result)
    } catch (error) {
      console.error("Error during technical analysis:", error)
      toast({
        variant: "destructive",
        title: "Error de Análisis",
        description: "No se pudo completar el análisis. Por favor, inténtalo de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setImagePreview(null);
    setAnalysisResult(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }
  
  const renderAnalysisContent = () => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">La IA está analizando la imagen...<br/>Esto puede tardar unos segundos.</p>
            </div>
        );
    }
    if (!analysisResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <UploadCloud className="h-12 w-12 mb-4" />
                <p className="font-semibold">Los resultados del análisis aparecerán aquí.</p>
                <p className="text-sm">Sube o pega un gráfico para comenzar.</p>
            </div>
        );
    }

    const { analysis, summary, indicators } = analysisResult;

    return (
        <Tabs defaultValue="analysis">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analysis">Análisis Detallado</TabsTrigger>
                <TabsTrigger value="summary">Resumen y Niveles</TabsTrigger>
                <TabsTrigger value="indicators">Indicadores Clave</TabsTrigger>
            </TabsList>
            <TabsContent value="analysis" className="space-y-4 text-sm mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><TrendingUp />Tendencia General</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{analysis.generalTrend}</p>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><CandlestickChart />Patrones Identificados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{analysis.patterns}</p>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><GanttChartSquare />Otras Señales Técnicas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{analysis.signals}</p>
                    </CardContent>
                 </Card>
                 <Card className="bg-accent/50 border-accent">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">Conclusión</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-accent-foreground/90 font-medium">{analysis.conclusion}</p>
                    </CardContent>
                 </Card>
            </TabsContent>
            <TabsContent value="summary" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Resumen de Tendencias</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableBody>
                                <TableRow>
                                    <TableHead>Corto Plazo</TableHead>
                                    <TableCell>{summary.trends.shortTerm}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Medio Plazo</TableHead>
                                    <TableCell>{summary.trends.mediumTerm}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Largo Plazo</TableHead>
                                    <TableCell>{summary.trends.longTerm}</TableCell>
                                </TableRow>
                             </TableBody>
                        </Table>
                    </CardContent>
                 </Card>
                 <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Soportes Clave</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    {summary.supports.map((s, i) => (
                                        <TableRow key={`s-${i}`}><TableCell className="font-bold">{s.level}</TableCell><TableCell>{s.reason}</TableCell></TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-lg">Resistencias Clave</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    {summary.resistances.map((r, i) => (
                                        <TableRow key={`r-${i}`}><TableCell className="font-bold">{r.level}</TableCell><TableCell>{r.reason}</TableCell></TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                 </div>
            </TabsContent>
            <TabsContent value="indicators" className="mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <Card className="min-h-[280px]">
                        <CardHeader>
                            <CardTitle className="text-lg">Indicador RSI</CardTitle>
                            {!indicators.rsi.isVisible && <CardDescription className="flex items-center gap-1 text-xs text-amber-600"><AlertCircle className="h-3 w-3" />No visible en el gráfico, valor estimado.</CardDescription>}
                        </CardHeader>
                        <CardContent>
                            <RsiGauge value={indicators.rsi.value} />
                        </CardContent>
                    </Card>
                     <Card className="min-h-[280px]">
                        <CardHeader>
                            <CardTitle className="text-lg">Indicador MACD</CardTitle>
                             {!indicators.macd.isVisible && <CardDescription className="flex items-center gap-1 text-xs text-amber-600"><AlertCircle className="h-3 w-3" />No visible en el gráfico.</CardDescription>}
                        </CardHeader>
                        <CardContent>
                           <MacdIndicator status={indicators.macd.status} comment={indicators.macd.comment} />
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
    )
  }

  return (
    <div className="flex flex-col w-full">
        <main className="flex-1 p-4 md:p-6 lg:p-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Columna de subida y visualización */}
                <div className="flex flex-col gap-4">
                    <Card>
                    <CardHeader>
                        <CardTitle>1. Sube tu Gráfico</CardTitle>
                        <CardDescription>Para mejores resultados, incluye indicadores como RSI y MACD en la imagen.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                        <Label htmlFor="chart-image">Imagen del Gráfico (.jpg, .png)</Label>
                        <Input 
                            id="chart-image" 
                            type="file" 
                            accept="image/jpeg, image/png" 
                            onChange={handleFileChange}
                            ref={fileInputRef} 
                        />
                        <div className="text-sm text-center text-muted-foreground p-2 border-dashed border-2 rounded-md">
                            <ClipboardPaste className="inline-block h-5 w-5 mr-2" />
                            <span>O pega la imagen directamente (Ctrl+V)</span>
                        </div>
                        </div>
                        {imagePreview && (
                        <div className="mt-4 border rounded-md p-2 relative">
                            <Image
                            src={imagePreview}
                            alt="Vista previa del gráfico"
                            width={500}
                            height={300}
                            className="w-full h-auto object-contain rounded-md"
                            data-ai-hint="stock chart"
                            />
                        </div>
                        )}
                    </CardContent>
                    </Card>
                    <div className="flex flex-col gap-2">
                        <Button onClick={handleAnalyzeClick} disabled={!imagePreview || isLoading} size="lg">
                        {isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analizando...
                            </>
                        ) : (
                            <>
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            Analizar Gráfico
                            </>
                        )}
                        </Button>
                        <Button onClick={handleReset} variant="outline" className="w-full" disabled={isLoading}>
                            Reiniciar
                        </Button>
                    </div>
                </div>

                {/* Columna de resultados */}
                 <Card className="flex flex-col h-[calc(100vh-12rem)]">
                    <CardHeader>
                        <CardTitle>2. Resultados del Análisis</CardTitle>
                        <CardDescription>La IA ha analizado el gráfico de velas.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        {renderAnalysisContent()}
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
