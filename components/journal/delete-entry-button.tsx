"use client";

import { Trash2 } from "lucide-react";
import { useActionState } from "react";
import { deleteEntry } from "../../app/journal/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export function DeleteEntryButton({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(deleteEntry, null);

  return (
    <AlertDialog>
      <AlertDialogTrigger
        aria-label="Delete entry"
        className="pressable grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground hover:border-rec/50 hover:text-rec"
      >
        <Trash2 className="size-4" aria-hidden />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
          <AlertDialogDescription>
            It’s gone for good — some dreams don’t come back twice.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {state?.error ? (
          <p role="alert" className="text-sm/tight text-rec">
            {state.error}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            <AlertDialogAction
              type="submit"
              disabled={pending}
              className="pressable bg-rec text-white hover:bg-rec/85 dark:bg-rec dark:hover:bg-rec/85"
            >
              {pending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
