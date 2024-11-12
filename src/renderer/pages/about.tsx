import { useQuery } from "@tanstack/react-query";

export function About(){


  const {data, isFetching} = useQuery({queryKey: ["version-app"], queryFn: async () => {
    const response = await window.api.getVersionApp();
    return response;
  }})

  return(
    <div className="flex-1 flex flex-col py-12 px-10 text-white ">
      <h1 className="text-white text-xl lg:text-3xl font-semibold mb-4">
        Sobre nós
      </h1>
      <p>Sobre o projeto</p>
      <p>Versão atual do projeto: {!isFetching && data && data}</p>
    </div>
  );
}