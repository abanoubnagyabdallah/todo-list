import { ChangeEvent, useState } from "react";
import Paginator from "../components/Paginator";
import Button from "../components/ui/Button";
import useCustomQuery from "../hooks/useAuthenticatedQuery";
import { onGenerateTodos } from "../utils/functions";

const TodosPage = () => {
  // =============== start state ===========
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageSort, setPageSort] = useState<string>('DESC')
  // =============== end state ===========

  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;


  const { isLoading, data, isFetching } = useCustomQuery({
    queryKey: [`todosPage-${page}`, `${pageSize}`,`${pageSort}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=publishedAt:${pageSort}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  console.log(data);
  if (isLoading) return <h3>Loading..</h3>;

  // ======================== start handel ==================== 
  const handelClickNext = () => { setPage(next => next + 1) }
  const handelClickPrev = () => { setPage(prev => prev - 1) }
  const onChangePageSize = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
  }
  const changePageSort = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSort(event.target.value)
  }
  // ======================== end handel ==================== 


  return (
    <section className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between space-x-2 text-md">
        <Button size={"sm"} onClick={onGenerateTodos} title="Generate 100 records">
          Generate todos
        </Button>

       <div className="space-x-2">
       <select className="border-2 border-indigo-600 rounded-md p-2" value={pageSort} onChange={changePageSort}>
          <option disabled>Sort by</option>
          <option value="ASC">Oldest</option>
          <option value="DESC">Latest</option>
        </select>

        <select className="border-2 border-indigo-600 rounded-md p-2" value={pageSize} onChange={onChangePageSize}>
          <option disabled>Page size</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
       </div>
      </div>

      <div className="my-10 space-y-6">
        {data.data.length ? (
          data.data.map(({ id, attributes }: { id: number; attributes: { title: string } }, idx: number) => (
            <div
              key={id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <h3 className="w-full font-semibold">{idx + 1}- {attributes.title}</h3>
            </div>
          ))
        ) : (
          <h3>No todos yet!</h3>
        )}
        <Paginator page={page} pageCount={data.meta.pagination.pageCount} total={data.meta.pagination.total} onClickNext={handelClickNext} onClickPrev={handelClickPrev} isLoading={isLoading || isFetching} />
      </div>
    </section>
  );
};

export default TodosPage;
