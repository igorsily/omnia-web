import { useForm, useStore } from "@tanstack/react-form";
import { Plus, Save, Sparkles, X } from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldInfo } from "./field-info";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const intentFormSchema = z.object({
  name: z
    .string()
    .min(5, "O nome da intenção deve ter pelo menos 5 caracteres"),
  description: z.string(),
  questions: z.array(z.string()),
  responses: z.array(z.string()),
});

export default function IntentForm() {
  const { Field, handleSubmit, store, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      questions: [] as string[],
      responses: [] as string[],
    },
    onSubmit: (args) => {
      alert(JSON.stringify(args.value, null, 2));
    },
    validators: {
      onDynamic: intentFormSchema,
      onBlur: intentFormSchema,
    },
  });

  const questions = useStore(store, (state) => state.values.questions);
  const responses = useStore(store, (state) => state.values.responses);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
    >
      <Card>
        <CardContent>
          <div className="flex justify-end gap-3">
            <Button onClick={() => reset()} type="button" variant="outline">
              Limpar
            </Button>
            <Button className="min-w-32" type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Intenção
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Informações da Intenção
          </CardTitle>
          <CardDescription>
            Defina o nome e descrição da intenção que será reconhecida pelo NLP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Nome da Intenção <span className="text-destructive">*</span>
                </Label>
                <Input
                  className="font-mono"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ex: saudacao, consultar_saldo, agendar_reuniao"
                  value={field.state.value}
                />
                <p className="text-muted-foreground text-xs">
                  Use snake_case ou camelCase para identificar a intenção
                </p>
                <FieldInfo field={field} />
              </div>
            )}
          </Field>
          <Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Descrição</Label>
                <Textarea
                  className="font-mono"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Descreva o propósito desta intenção..."
                  rows={10}
                  value={field.state.value}
                />
                <FieldInfo field={field} />
              </div>
            )}
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Perguntas de Exemplo</CardTitle>
              <CardDescription>
                Adicione diferentes formas de expressar esta intenção
              </CardDescription>
            </div>
            <Badge className="text-sm" variant="secondary">
              {questions.filter((q) => q.trim()).length} pergunta(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field mode="array" name="questions">
            {(field) => (
              <div className="space-y-3">
                {field.state.value.map((_, i) => (
                  <Field key={i} name={`questions[${i}]`}>
                    {(subField) => (
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            onChange={(e) =>
                              subField.handleChange(e.target.value)
                            }
                            placeholder={`Pergunta ${i + 1}: Ex: "Olá", "Bom dia", "Oi, tudo bem?"`}
                            value={subField.state.value ?? ""}
                          />
                        </div>
                        <Button
                          className="shrink-0"
                          onClick={() => field.removeValue(i)}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remover pergunta</span>
                        </Button>
                      </div>
                    )}
                  </Field>
                ))}

                <Button
                  className="w-full bg-transparent"
                  onClick={() => field.pushValue("")}
                  type="button"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Pergunta
                </Button>
              </div>
            )}
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Respostas</CardTitle>
              <CardDescription>
                Configure as respostas que o assistente pode dar para esta
                intenção
              </CardDescription>
            </div>
            <Badge className="text-sm" variant="secondary">
              {responses.filter((r) => r.trim()).length} resposta(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field mode="array" name="responses">
            {(field) => (
              <div className="space-y-3">
                {field.state.value.map((_, i) => (
                  <Field key={i} name={`responses[${i}]`}>
                    {(subField) => (
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Textarea
                            onChange={(e) =>
                              subField.handleChange(e.target.value)
                            }
                            placeholder={`Resposta ${i + 1}: Ex: "Olá! Como posso ajudar você hoje?"`}
                            rows={2}
                            value={subField.state.value ?? ""}
                          />
                        </div>
                        <Button
                          className="shrink-0"
                          onClick={() => field.removeValue(i)}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remover resposta</span>
                        </Button>
                      </div>
                    )}
                  </Field>
                ))}

                <Button
                  className="w-full bg-transparent"
                  onClick={() => field.pushValue("")}
                  type="button"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Resposta
                </Button>
              </div>
            )}
          </Field>
        </CardContent>
      </Card>
    </form>
  );
}
