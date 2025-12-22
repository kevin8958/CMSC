import { useEffect, useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { TbMoodEmpty } from "react-icons/tb";
import { motion } from "framer-motion";
import { useAlert } from "../AlertProvider";
import Badge from "../Badge";
import Avatar from "../Avatar";

interface TaskCommentsProps {
  taskId: string;
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  // ✅ 댓글 불러오기
  const fetchComments = async () => {
    if (!taskId) return;
    const res = await fetch(`/api/tasks/comments/list?taskId=${taskId}`);
    const { data } = await res.json();
    setComments(data || []);
    setLoading(false);
  };

  // ✅ 댓글 등록
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { data: session } = await supabase.auth.getSession();
    const author_id = session.session?.user.id;

    const res = await fetch(`/api/tasks/comments/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: taskId, content: newComment, author_id }),
    });

    const { comment } = await res.json();
    if (comment) {
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    }
    showAlert(`댓글이 등록되었습니다.`, {
      type: "success",
      durationMs: 3000,
    });
  };

  //   // ✅ 댓글 삭제
  //   const handleDeleteComment = async (commentId: string) => {
  //     await fetch(`/api/tasks/comments/delete`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ comment_id: commentId }),
  //     });
  //     showAlert(`댓글이 삭제되었습니다.`, {
  //       type: "success",
  //       durationMs: 3000,
  //     });
  //     setComments((prev) => prev.filter((c) => c.id !== commentId));
  //   };

  useEffect(() => {
    setLoading(true);
    fetchComments();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, [taskId]);

  return (
    <FlexWrapper direction="col" gap={0} classes="pt-4 bg-gray-50 px-4 pb-6">
      <FlexWrapper gap={2} items="center">
        <Typography variant="H4">댓글</Typography>
        <Badge color="green" size="md">
          {comments.length || 0}
        </Badge>
      </FlexWrapper>

      {/* 입력창 */}

      {/* 목록 */}
      {loading ? (
        <FlexWrapper
          classes="h-[calc(100dvh-50px-358px-50px-30px-16px-60px)]"
          justify="center"
          items="center"
        >
          <motion.div
            className="size-4 rounded-full border-[3px] border-primary-900 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 1,
            }}
          />
        </FlexWrapper>
      ) : (
        <div>
          {comments.length === 0 && (
            <div className="h-[calc(100dvh-50px-358px-50px-30px-16px-60px)] flex flex-col items-center justify-center gap-2 p-6">
              <TbMoodEmpty className="text-4xl text-gray-300" />
              <p className="text-gray-400 text-sm">댓글이 없습니다</p>
            </div>
          )}

          <FlexWrapper
            direction="col"
            classes="py-3 h-[calc(100dvh-50px-358px-50px-30px-16px-60px)] overflow-y-auto scroll-thin"
            gap={1}
          >
            {comments.map((c) => (
              <FlexWrapper
                key={c.id}
                gap={1}
                items="start"
                classes={userId === c.author_id ? "!flex-row-reverse" : ""}
              >
                <FlexWrapper gap={1} items="center" direction="col">
                  <Avatar
                    size="sm"
                    type="text"
                    name={c.profiles?.display_name || "-"}
                  />
                  <Typography
                    variant="C1"
                    classes="!font-semibol text-gray-800 w-[60px] truncate"
                  >
                    {c.profiles?.display_name || "익명"}
                  </Typography>
                </FlexWrapper>
                <FlexWrapper
                  gap={1}
                  items={userId === c.author_id ? "end" : "start"}
                  direction="col"
                  classes="max-w-[calc(100%-120px)] bg-white rounded-lg border p-2 min-h-[62px]"
                >
                  <Typography
                    variant="B2"
                    classes="text-gray-700 whitespace-pre-wrap"
                  >
                    {c.content}
                  </Typography>
                  <Typography variant="C1" classes="!text-gray-400">
                    {dayjs(c.created_at).format("YYYY.MM.DD HH:mm")}
                  </Typography>
                </FlexWrapper>
              </FlexWrapper>
            ))}

            {/* {userId === c.author_id && (
                <Button
                  variant="clear"
                  size="sm"
                  classes="!text-danger !text-xs !self-end"
                  onClick={() => handleDeleteComment(c.id)}
                >
                  삭제
                </Button>
              )} */}
          </FlexWrapper>
          <FlexWrapper gap={2} items="center">
            <TextInput
              classes="flex-1 !h-[42px] !text-sm"
              value={newComment}
              onChange={(event) => {
                setNewComment(event?.target.value || "");
              }}
            />
            <Button
              variant="contain"
              color="green"
              classes="!px-3 !py-2 !text-sm shrink-0 !h-[42px]"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              등록
            </Button>
          </FlexWrapper>
        </div>
      )}
    </FlexWrapper>
  );
}
