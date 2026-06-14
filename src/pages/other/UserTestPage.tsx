import { useState } from "react";
import { PenLine, Plus, Trash2 } from "lucide-react";
import { useUserTest, queryKeyUserTest } from "../../features/other/user-test/hooks/useUserTest";
import { getUserErrorMessage } from "../../shared/errors/AppError";
import { Button } from "../../shared/ui/Button";
import { DataTable } from "../../shared/ui/DataTable";
import { Loader } from "../../shared/ui/Loader";
import { MyError } from "../../shared/ui/MyError";
import { Modal } from "../../shared/ui/Modal";
import {
  UserTestForm,
} from "../../features/other/user-test/components/UserTestForm";
import { useCreateUserTest } from "../../features/other/user-test/hooks/useCreateUserTest";
import { useUpdateUserTest } from "../../features/other/user-test/hooks/useUpdateUserTest";
import { useDeleteUserTest } from "../../features/other/user-test/hooks/useDeleteUserTest";
import type { UserTest } from "../../features/other/user-test/model/userTest.types";
import { useQueryClient } from "@tanstack/react-query";
import { mapUserTestToFormValues } from "../../features/other/user-test/lib/userTest.mapper";

type ModalMode = "create" | "delete" | "update" | null;

export function UserTestPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUserTest, setSelectedUserTest] = useState<UserTest | null>(null);

  const {
    data: usersTest = [],
    isPending: isUsersTestPending,
    isError: isUsersTestError,
    error: usersTestError,
  } = useUserTest();

  const {
    mutateAsync: createUserTestAsync,
    isPending: isCreatePending,
    error: createError,
    reset: resetCreateMutation,
  } = useCreateUserTest();
  const {
    mutateAsync: updateUserTestAsync,
    isPending: isUpdatePending,
    error: updateError,
    reset: resetUpdateMutation,
  } = useUpdateUserTest();
  const {
    mutateAsync: deleteUserTestAsync,
    isPending: isDeletePending,
    error: deleteError,
    reset: resetDeleteMutation,
  } = useDeleteUserTest();

  function closeModal() {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedUserTest(null);
    resetCreateMutation();
    resetUpdateMutation();
    resetDeleteMutation();
  }

  if (isUsersTestPending) {
    return <Loader label="Chargement des données de user test" />;
  }

  if (isUsersTestError) {
    return (
      <MyError>
        {getUserErrorMessage(usersTestError, "Erreur lors du chargement de user test", true)}
      </MyError>
    );
  }

  return (
    <>
      <div className="col-span-12">
        <DataTable
          tableHeads={[
            "Id",
            "Nom",
            "Prénom",
            "Date de naissance",
            "Favorite number",
            "Date d'ajout",
            "Date d'update",
            "Supprimé",
            "Action",
          ]}
          toolbar={(
            <Button
              onClick={() => {
                setModalMode("create");
                setIsModalOpen(true);
              }}
            >
              <Plus size={18} />
              Ajouter
            </Button>
          )}
        >
          {usersTest.map((userTest) => (
            <tr key={userTest.id}>
              <td className="border border-(--panel-border) px-4 py-4">{userTest.id}</td>
              <td className="border border-(--panel-border) px-4 py-4">{userTest.nom}</td>
              <td className="border border-(--panel-border) px-4 py-4">{userTest.prenom}</td>
              <td className="border border-(--panel-border) px-4 py-4">{userTest.dateDeNaissance}</td>
              <td className="border border-(--panel-border) px-4 py-4">{userTest.favoriteNumber}</td>
              <td className="border border-(--panel-border) px-4 py-4">{userTest.dateAdd}</td>
              <td className="border border-(--panel-border) px-4 py-4">{userTest.dateUpdate}</td>
              <td className="border border-(--panel-border) px-4 py-4">{String(userTest.deleted)}</td>
              <td className="border border-(--panel-border) px-4 py-4">
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setSelectedUserTest(userTest);
                      setModalMode("update");
                      setIsModalOpen(true);
                    }}
                  >
                    <PenLine size={18} />
                  </Button>

                  <Button
                    className="bg-red-600"
                    onClick={() => {
                      setSelectedUserTest(userTest);
                      setModalMode("delete");
                      setIsModalOpen(true);
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={
          modalMode === "create"
            ? "Ajouter un user test"
            : modalMode === "update"
              ? "Modifier un user test"
              : "Supprimer un user test"
        }
        onClose={closeModal}
      >
        {modalMode === "create" && (
          <UserTestForm
            isPending={isCreatePending}
            submitError={createError}
            submitLabel="Ajouter"
            onCancel={closeModal}
            onSubmit={async (values) => {
              await createUserTestAsync(values);
              await queryClient.invalidateQueries({ queryKey: queryKeyUserTest });
              closeModal();
            }}
          />
        )}

        {modalMode === "update" && selectedUserTest && (
          <UserTestForm
            initialValues={mapUserTestToFormValues(selectedUserTest)}
            isPending={isUpdatePending}
            submitError={updateError}
            submitLabel="Modifier"
            onCancel={closeModal}
            onSubmit={async (values) => {
              await updateUserTestAsync({
                id: selectedUserTest.id,
                payload: values,
              });
              await queryClient.invalidateQueries({ queryKey: queryKeyUserTest });
              closeModal();
            }}
          />
        )}

        {modalMode === "delete" && selectedUserTest && (
          <section className="space-y-5">
            {deleteError && (
              <MyError className="rounded-2xl p-3">
                {getUserErrorMessage(deleteError, "Erreur lors de la suppression", true)}
              </MyError>
            )}

            <p className="text-center text-(--text-primary)">
              Voulez-vous vraiment supprimer{" "}
              <span className="font-semibold">
                {selectedUserTest.nom} {selectedUserTest.prenom}
              </span>
              {" "}?
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                className="justify-center bg-red-600"
                type="button"
                onClick={closeModal}
              >
                Annuler
              </Button>
              <Button
                className="justify-center"
                disabled={isDeletePending}
                type="button"
                onClick={async () => {
                  await deleteUserTestAsync(selectedUserTest.id);
                  await queryClient.invalidateQueries({ queryKey: queryKeyUserTest });
                  closeModal();
                }}
              >
                {isDeletePending ? "Suppression..." : "Valider"}
              </Button>
            </div>
          </section>
        )}
      </Modal>
    </>
  );
}
