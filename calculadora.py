print("I live in Brazil, and I like playing chess, I'm a loto of difficult win ")
print("Eu sou o Theo Singer, e gosto de jogar videogames")


def somar(a, b):
    print(f"Somando {a} + {b}")
    return a + b



def subtrair(a, b):
    print(f"Subtraindo {a} e {b}")
    return a - b


def multiplicar(a, b):
    print(f"Multiplicando {a} e {b}")
    return a * b 

def dividir(a, b):
    print(f"Dividindo {a} e {b}")
    if b == 0:
        print("Erro: Divisão por zero não é permitida.")
        return None
    return a / b

# calculadora
conta = input("Digite a operação desejada (somar, subtrair, multiplicar, dividir): ")
a = int(input("Digite o primeiro número: "))
b = int(input("Digite o segundo número: "))

soma = somar(a, b)
subtracao = subtrair(a, b)
multiplicacao = multiplicar(a, b)
divisao = dividir(a, b)

if conta == "somar":
    print(f"O resultado da soma é: {soma}")
elif conta == "subtrair":
    print(f"O resultado da subtração é: {subtracao}")
elif conta == "multiplicar":
    print(f"O resultado da multiplicação é: {multiplicacao}")
elif conta == "dividir":
    if divisao is not None:
        print(f"O resultado da divisão é: {divisao}")
else:
    print("Operação inválida. Por favor, escolha entre somar, subtrair, multiplicar ou dividir.")