import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import Button from "@/components/Button";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import { LuPlus } from "react-icons/lu";
import { TbMoodEmpty } from "react-icons/tb";

// Stores & Hooks
import { useClientStore } from "@/stores/useClientStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useWorkerStore } from "@/stores/useWorkerStore";
import { useAuthStore } from "@/stores/authStore";
import { useAlert } from "@/components/AlertProvider";
import { useDialog } from "@/hooks/useDialog";

// Components
import ClientDrawer from "@/components/clientManage/ClientDrawer";
import ClientCard from "@/components/clientManage/ClientCard";
import ClientBoardSkeleton from "@/components/clientManage/ClientBoardSkeleton";
import Badge from "@/components/Badge";

const CLIENT_STATUS = {
  ACTIVE: "active",
  TERMINATED: "terminated",
} as const;

export default function ClientManagement() {
  // 1. States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentClient, setCurrentClient] = useState<Client.Client | null>(
    null
  );

  // 2. Stores
  const {
    clients,
    fetching,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    setClients,
  } = useClientStore();
  const { currentCompanyId } = useCompanyStore();
  const { allList: workers, fetchAll } = useWorkerStore();
  const { role } = useAuthStore();
  const { showAlert } = useAlert();
  const { openDialog } = useDialog();

  // 3. Initial Fetch
  useEffect(() => {
    if (currentCompanyId) {
      fetchClients(currentCompanyId);
      fetchAll(currentCompanyId);
    }
  }, [currentCompanyId]);

  // 4. Drag and Drop Handler
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newClients = [...clients];
    const draggedItem = newClients.find((c) => c.id === draggableId);
    if (!draggedItem) return;

    const filtered = newClients.filter((c) => c.id !== draggableId);
    const updatedItem = {
      ...draggedItem,
      status: destination.droppableId as "active" | "terminated",
    };

    setClients([...filtered, updatedItem]);

    if (currentCompanyId) {
      if (destination.droppableId !== source.droppableId) {
        showAlert("거래 상태가 변경되었습니다.", { type: "success" });
      }
      await updateClient(draggableId, { status: updatedItem.status });
    }
  };

  if (fetching) return <ClientBoardSkeleton />;

  return (
    <>
      {/* 헤더 영역 */}
      <FlexWrapper classes="mb-4 lg:mb-6" items="center" justify="between">
        <Typography variant="H3" classes="text-xl lg:text-2xl">
          거래처 관리
        </Typography>
        {role === "admin" && (
          <Button
            variant="contain"
            color="green"
            size="md"
            classes="gap-1 !px-2 lg:!px-3 text-sm lg:text-base"
            onClick={() => {
              setDrawerMode("create");
              setCurrentClient(null);
              setDrawerOpen(true);
            }}
          >
            <LuPlus className="text-lg" />
            <span className="hidden xs:inline">거래처 추가</span>
            <span className="xs:hidden font-bold">추가</span>
          </Button>
        )}
      </FlexWrapper>

      {/* 보드 영역 */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row w-full gap-6 lg:h-[calc(100dvh-76px-36px-16px-24px)] overflow-y-auto lg:overflow-visible">
          {/* 1. 왼쪽: 거래 중 (Grid Layout) */}
          <div className="flex-1 flex flex-col min-w-0 min-h-[400px] lg:min-h-0">
            <FlexWrapper items="center" gap={2} classes="mb-3 lg:mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <Typography variant="H4">거래 중</Typography>
              <Badge color="green" size="md">
                {clients.filter((c) => c.status === "active").length}
              </Badge>
            </FlexWrapper>

            <Droppable
              droppableId={CLIENT_STATUS.ACTIVE}
              direction="horizontal"
            >
              {(provided) => {
                const activeClients = clients.filter(
                  (c) => c.status === "active"
                );
                const isEmpty = activeClients.length === 0;

                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      bg-white border border-dashed rounded-xl p-3 overflow-y-auto w-full h-full
                      ${
                        isEmpty
                          ? "flex flex-col items-center justify-center py-10 lg:py-0"
                          : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  lg:gap-4 content-start"
                      }
                    `}
                  >
                    {!isEmpty ? (
                      activeClients.map((client, index) => (
                        <Draggable
                          key={client.id}
                          draggableId={client.id}
                          index={index}
                        >
                          {(p) => (
                            <div
                              ref={p.innerRef}
                              {...p.draggableProps}
                              {...p.dragHandleProps}
                              className="h-fit"
                              onClick={() => {
                                setDrawerMode("edit");
                                setCurrentClient(client);
                                setDrawerOpen(true);
                              }}
                            >
                              <ClientCard client={client} workers={workers} />
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <TbMoodEmpty className="text-4xl mb-2" />
                        <p className="text-sm font-medium">
                          거래 중인 업체가 없습니다
                        </p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>

          {/* 2. 오른쪽: 거래 종료 (Sidebar Layout) */}
          <div className="w-full lg:w-[340px] flex flex-col flex-shrink-0 min-h-0">
            <FlexWrapper items="center" gap={2} classes="mb-3 lg:mb-4">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <Typography variant="H4">거래 종료</Typography>
              <Badge color="green" size="md">
                {clients.filter((c) => c.status === "terminated").length}
              </Badge>
            </FlexWrapper>

            <Droppable droppableId={CLIENT_STATUS.TERMINATED}>
              {(provided) => {
                const terminatedClients = clients.filter(
                  (c) => c.status === "terminated"
                );
                const isEmpty = terminatedClients.length === 0;

                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      bg-white border rounded-xl p-3 overflow-y-auto flex flex-col  
                      max-h-[400px] lg:max-h-none lg:h-full
                      ${isEmpty ? "items-center justify-center py-10 lg:py-0" : ""}
                    `}
                  >
                    {!isEmpty ? (
                      terminatedClients.map((client, index) => (
                        <Draggable
                          key={client.id}
                          draggableId={client.id}
                          index={index}
                        >
                          {(p) => (
                            <div
                              ref={p.innerRef}
                              {...p.draggableProps}
                              {...p.dragHandleProps}
                              onClick={() => {
                                setDrawerMode("edit");
                                setCurrentClient(client);
                                setDrawerOpen(true);
                              }}
                            >
                              <ClientCard
                                client={client}
                                workers={workers}
                                isTerminated
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 opacity-60">
                        <TbMoodEmpty className="text-4xl mb-2" />
                        <p className="text-sm">종료된 거래처가 없습니다</p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      <ClientDrawer
        open={drawerOpen}
        disabled={role !== "admin"}
        mode={drawerMode}
        client={currentClient}
        workers={workers}
        onClose={() => {
          setDrawerOpen(false);
          setCurrentClient(null);
        }}
        onSubmit={async (data) => {
          if (!currentCompanyId) return;
          if (drawerMode === "create") {
            await createClient(currentCompanyId, data);
            showAlert("거래처가 추가되었습니다.", { type: "success" });
          } else if (drawerMode === "edit" && currentClient) {
            await updateClient(currentClient.id, data);
            showAlert("거래처 정보가 수정되었습니다.", { type: "success" });
          }
          setDrawerOpen(false);
        }}
        onDelete={
          drawerMode === "edit"
            ? async () => {
                await openDialog({
                  title: "거래처 삭제",
                  message: `"${currentClient?.name}" 거래처를 제거하시겠습니까?`,
                  confirmText: "삭제",
                  cancelText: "취소",
                  state: "danger",
                  onConfirm: async () => {
                    if (currentClient) {
                      await deleteClient(currentClient.id);
                      showAlert("삭제되었습니다.", { type: "success" });
                    }
                    setDrawerOpen(false);
                    return true;
                  },
                });
              }
            : undefined
        }
      />
    </>
  );
}
