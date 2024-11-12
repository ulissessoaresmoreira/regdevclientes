import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FormEvent, useRef } from "react";
import {useNavigate} from 'react-router-dom'


interface DataMutation{
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
}


export function Create(){
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const addressRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const roleRef = useRef<HTMLInputElement | null>(null)

  const {isPending, mutateAsync: createCustomer } = useMutation({mutationFn: async (data: DataMutation) => {
    await window.api.addCustomer({
      name: data.name,
      email: data.email,
      role: data.role,
      address: data.address,
      phone: data.phone,
      status: true
    }).then((response) => {
      console.log("Registro feito com sucesso")
      // console.log(response)
      navigate("/")
    })
    .catch((error) => {
      console.log("Erro ao registar cliente: ", error)
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["customers"]})
}})

  async function handleAddCustomer(event: FormEvent){
    event.preventDefault();

    const name = nameRef.current?.value;
    const address = addressRef.current?.value;
    const email = emailRef.current?.value;
    const phone = phoneRef.current?.value;
    const role = roleRef.current?.value;

    if(!name || !address || !email || !phone || !role){
      return;
    }

    await createCustomer({
      name: name,
      email: email,
      address: address,
      phone: phone,
      role: role,
    })

    // console.log({
    //   name,
    //   email,
    //   address,
    //   phone,
    //   role
    // })

    // const doc = {
    //   name: "Seu cuque eu",
    //   email: "seucuca@gmail.com",
    //   phone: "234567890",
    //   address: "Rua X, centro",
    //   role: "FrontEnd",
    //   status: true,
    // }
  }

  return(
    <div className="flex-1 flex flex-col py-12 px-10 gap-8 overflow-y-auto">
      <section className="flex flex-1 flex-col items-center ">
        <h1 className="text-white text-xl lg:text-3xl font-semibold ">
          Registar novo cliente
        </h1>
        <form className="w-full max-w-96 mt-4 " onSubmit={handleAddCustomer}>
          <div className="mb-2">
            <label className="text-lg">Nome: </label>
            <input
              type="text"
              placeholder="Digite o nome do cliente..."
              className="w-full h-9 rounded text-black px-2"
              ref={nameRef}
            />
          </div>

          <div className="mb-2">
            <label className="text-lg">Morada: </label>
            <input
              type="text"
              placeholder="Digite a morada do cliente..."
              className="w-full h-9 rounded text-black px-2"
              ref={addressRef}
            />
          </div>

          <div className="mb-2">
            <label className="text-lg">Email: </label>
            <input
              type="text"
              placeholder="Digite o email do cliente..."
              className="w-full h-9 rounded text-black px-2"
              ref={emailRef}
            />
          </div>

          <div className="mb-2">
            <label className="text-lg">Cargo: </label>
            <input
              type="text"
              placeholder="Digite o cargo do cliente..."
              className="w-full h-9 rounded text-black px-2"
              ref={roleRef}
            />
          </div>

          <div className="mb-2">
            <label className="text-lg">Contacto telefónico: </label>
            <input
              type="text"
              placeholder="Digite o telefone do cliente..."
              className="w-full h-9 rounded text-black px-2"
              ref={phoneRef}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 rounded flex items-center justify-center w-full h-9 mt-4 disabled:bg-gray-500"
            disabled={isPending}
          >
            Registar
          </button>

        </form>
      </section>
    </div>
  );
}