import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton";
import { onGenerateTodos } from "../utils/functions";

const TodoList = () => {
  // ============================== start state ===================
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenRemove, setIsOpenRemove] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editTodo, setEditTodo] = useState<ITodo>({ id: 0, title: "", description: "" })
  const [AddTodo, setAddTodo] = useState({ title: "", description: "" })
  const [queryVersion, setQueryVersion] = useState(1)
  // ============================== end state ===================

  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  // useEffect(() => {
  //   try {
  //     axiosInstance.get('/users/me?populate=todos', { headers: { Authorization: `Bearer ${userData.jwt}` } })
  //       .then((res) => console.log(res.data.todos[0]))
  //       .catch(err => console.log("the error", err))
  //   } catch (error) {
  //     console.log(error);
  //   }
  // })


  const { isLoading, data } = useAuthenticatedQuery({ queryKey: ['TodoList', `${queryVersion}`], url: '/users/me?populate=todos', config: { headers: { Authorization: `Bearer ${userData.jwt}` } } })
  if (isLoading) return (
    <div className="space-y-3">
      <TodoSkeleton />
      <TodoSkeleton />
      <TodoSkeleton />
    </div>
  )

  // ============================== start handel ===================
  

  const openAddModal = () => {
    setIsOpenAdd(true)
  }
  const closeAddModal = () => {
    setIsOpenAdd(false)
  }

  const closeModalEdit = () => {
    setIsOpenEdit(false)
    setEditTodo({ id: 0, title: "", description: "" })
  }
  const openModalEdit = (todo: ITodo) => {
    setIsOpenEdit(true)
    setEditTodo(todo)
  }

  const closeModalRemove = () => setIsOpenRemove(false)
  const openModalRemove = (todo: ITodo) => {
    setIsOpenRemove(true)
    setEditTodo(todo)
    console.log(editTodo);

  }

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(event.target.value);
    const { name, value } = event.target
    setEditTodo({
      ...editTodo,
      [name]: value
    })
  }

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsUpdating(true)
    try {
      const { id, title, description } = editTodo
      const res = await axiosInstance.put(`/todos/${id}`,
        { data: { title, description } },
        { headers: { Authorization: `Bearer ${userData.jwt}` } }
      )
      console.log(res);
      if (res.status === 200) {
        closeModalEdit()
        setQueryVersion(prev=>prev+1)
      }
    } catch (error) {
      console.log(error);
    } finally { setIsUpdating(false) }
  }

  const removeTodoOnSubmit = async () => {
    try {
      const { id } = editTodo
      const res = await axiosInstance.delete(`/todos/${id}`, { headers: { Authorization: `Bearer ${userData.jwt}` } })
      if (res.status === 200) {
        closeModalRemove()
        setQueryVersion(prev => prev + 1)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handelAddTodoChangeEvent = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setAddTodo({
      ...AddTodo,
      [name]: value
    })
  }

  const handelAddModal = async () => {
    // console.log(AddTodo);
    const { title, description } = AddTodo
    try {
      const res = await axiosInstance.post(`/todos`, { data: { title, description,user:[userData.user.id] } }, { headers: { Authorization: `Bearer ${userData.jwt}` } })
      if (res.status === 200) {
        setAddTodo({ title: "", description: "" })
        closeAddModal()
        setQueryVersion(prev=>prev+1)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // ============================== end handel ===================

  return (
    <div className="space-y-1">
      <>
        <div className="flex mx-auto my-10 w-fit space-x-3">
          <Button size={'sm'} onClick={openAddModal}>Post new todo</Button>
          <Button variant={"outline"} size={'sm'} onClick={onGenerateTodos}>Generate todos</Button>
        </div>
        {data.todos.length ? data.todos.map((todo: ITodo) => {
          return (
            <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
              <p className="w-full font-semibold">{todo.id}-{todo.title}</p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button size={"sm"} onClick={() => openModalEdit(todo)}> Edit </Button>
                <Button variant={"danger"} size={"sm"} onClick={() => { openModalRemove(todo) }}> Remove </Button>
              </div>
            </div>
          )
        }) : <h3>No todos yet</h3>}
      </>

      {/* add new todo modal */}
      <Modal isOpen={isOpenAdd} closeModal={closeAddModal} title={'Add Todo'}>
        <div className="space-y-3">
          <Input name="title" value={AddTodo.title} onChange={handelAddTodoChangeEvent} />
          <Textarea name="description" value={AddTodo.description} onChange={handelAddTodoChangeEvent} />
          <div className="flex items-center space-x-4 ">
            <Button onClick={handelAddModal}>Add</Button>
            <Button type="button" variant={'cancel'} onClick={closeAddModal}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* edit todo modal */}
      <Modal isOpen={isOpenEdit} closeModal={closeModalEdit} title={'Edit Todo'} >
        <form className="space-y-3" onSubmit={submitHandler}>
          <Input name="title" value={editTodo.title} onChange={onChangeHandler} />
          <Textarea name="description" value={editTodo.description} onChange={onChangeHandler} />
          <div className="flex items-center space-x-4 ">
            <Button isLoading={isUpdating}>Update</Button>
            <Button type="button" variant={'cancel'} onClick={closeModalEdit}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* remove todo modal */}
      <Modal isOpen={isOpenRemove} closeModal={closeModalRemove} title={'are you sure you want to remove this todo  from your store'} description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action.">
        <div className="flex items-center space-x-4 mt-3">
          <Button variant={"danger"} size={"sm"} onClick={removeTodoOnSubmit}>Yes, remove</Button>
          <Button type="button" variant={"cancel"} size={"sm"} onClick={closeModalRemove}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;