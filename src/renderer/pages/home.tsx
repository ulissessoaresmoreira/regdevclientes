import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export function Home(){
  const queryClientes = useQueryClient();

  //BUSCAR OS CLIENTES
  const {data, isFetching} = useQuery({queryKey: ["customers"], queryFn: async () => {
    const response = await window.api.fetchAllCustomers();
    // console.log(response);
    return response;
  }})

  // async function handleAdd(){
  //   const response = await window.api.fetchAllCustomers();
  //   console.log(response);
  // }

  // async function handleCustomerById(){
  //   const response = await window.api.fetchCustomerById("af4ea795-e7e2-4340-bcb3-b210d7570a87");
  //   console.log(response.name);    
  // }

  // async function handleDeleteCustomerById(){
  //   const docId = "526f90f8-ec5d-48f3-a5eb-2b5827bb1934"
  //   const response = await window.api.deleteCustomer(docId)
  //   console.log(response);
  // }

  return(
    <div className="flex-1 flex flex-col py-12 text-white overflow-y-auto ">
      <div className="px-10">
        <h1 className="text-white text-xl lg:text-3xl font-semibold mb-4">
          Clientes ativos
        </h1>
      </div>
      <section className="flex-1 flex flex-col gap-6 w-full h-screen px-10 pb-[200px]">
        {!isFetching && data?.length === 0 && (
          <p className="text-gray-300">Nenhum cliente registado...</p>
        )}
        {data?.map((customer) => (
          <Link 
            to={`/customer/${customer._id}`}
            key={customer._id}
            className="bg-gray-800 px-4 py-3 rounded"
          >
            <p className="mb-2 font-semibold text-lg">{customer.name}</p>
            <p> <span className="font-semibold">Email : </span> {customer.email}</p>
            <p className="font-semibold text-lg">{customer.status}</p>
            {customer.phone && (
              <p>
                <span className="font-semibold"> Contacto telefónico: </span>
                {customer.phone}
              </p>
            )}
          </Link>
        ))}
      </section>
    </div>
  );
}