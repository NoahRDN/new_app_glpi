import { useMemo, useState } from "react";
import type { CreateTicketPayload } from "../../../../entities/ticket/model/ticket.types";
import { getDeveloperErrorDetails, getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { MyError } from "../../../../shared/ui/MyError";
import { useCreateTicket } from "../hooks/useCreateTicket";
import { createTicketDefault } from "../../../../entities/ticket/model/ticket.config";
import { Textarea } from "../../../../shared/ui/Textarea";
import { Button } from "../../../../shared/ui/Button";
import { Select } from "../../../../shared/ui/Select";
import { Plus } from "lucide-react";
import { useAssets } from "../../../backoffice/assets/hooks/useAssets";
import { generalViewAssetItemsFiltersDefaultValues } from "../../general-view-asset-items/model/generalViewAssetItems.config";
import { useAllGeneralViewAssetItems } from "../../general-view-asset-items/hooks/useAllGeneralViewAssetItems";
import type { GeneralViewAssetItems } from "../../general-view-asset-items/model/generalViewAssetItems.types";
import { linkAssetToTicket } from "../../../../entities/ticket/api/ticketItem.api";
import { createTicketTeamMember } from "../../../../entities/ticket/api/ticketTeam.api";
import { useUsers } from "../../../backoffice/users/hooks/useUsers";
import { TICKET_TYPE_LABELS } from "../../../../entities/user/model/user.configs";
import { useGroups } from "../../../backoffice/groups/hooks/useGroups";

type SelectedTicketElement = {
  itemtype: string;       
  itemtypeLabel: string;
  items_id: number;
  name: string;
};


type TicketsAddProps = {
  onClose?: () => void;
  isModal?: boolean
};

export function TicketsAdd({ onClose, isModal = false}: TicketsAddProps){
    const [assetTypeItemSelected, setAssetTypeItemSelected] = useState("");
    const [assetItemSelected, setAssetItemSelected] = useState("");
    const [selectedElements, setSelectedElements] = useState<SelectedTicketElement[]>([]);
    const [myAssetItemSelected, setMyAssetItemSelected] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
    const [selectedTechnicianUserId, setSelectedTechnicianUserId] = useState<number | undefined>(undefined);
    const [selectedTechnicianGroupId, setSelectedTechnicianGroupId] = useState<number | undefined>(undefined);

    const {
        mutateAsync: createTicketAsync,
        isPending: isCreatingTicket,
        isError: isCreatePrinterError,
        error: createPrinterError,
        isSuccess: isTicketSuccess,
    } = useCreateTicket();

    const {
        data: assetsData,
        isError: isAssetsError,
        error: assetsError,
    } = useAssets();

    const {
        data: users = [],
        isError: isUsersError,
        error: usersError,
    } = useUsers();

    const {
        data: groups = [],
        isError: isGroupsError,
        error: groupsError,
    } = useGroups();

    const {
        data: allGeneralViewAssetItemsPage,
        isError: isAllGeneralViewAssetItemsError,
        error: allGeneralViewAssetItemsError,
    } = useAllGeneralViewAssetItems({
        ...generalViewAssetItemsFiltersDefaultValues,
        userId: selectedUserId,
    });

    const {
        data: assetItemsSelected,
        isError: isAssetItemsSelectedError,
        error: assetItemsSelectedError,
    } = useAllGeneralViewAssetItems({...generalViewAssetItemsFiltersDefaultValues,itemtypes: [assetTypeItemSelected]});

    const [form, setForm] = useState<CreateTicketPayload>({...createTicketDefault});

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const name = form.name.trim();
        const content = form.content.trim();

        if (name.length === 0 || content.length === 0) {
            return;
        }

        try {
            const createdTicket = await createTicketAsync({
                ...form,
                name,
                content,
            });

            if (selectedTechnicianUserId !== undefined) {
                await createTicketTeamMember({
                    ticketId: createdTicket.id,
                    payload: {
                        id: selectedTechnicianUserId,
                        role: "assigned",
                        type: "User",
                    },
                });
            }

            if (selectedTechnicianGroupId !== undefined) {
                await createTicketTeamMember({
                    ticketId: createdTicket.id,
                    payload: {
                        id: selectedTechnicianGroupId,
                        role: "assigned",
                        type: "Group",
                    },
                });
            }

            for (const element of selectedElements) {
            await linkAssetToTicket({
                ticketId: createdTicket.id,
                itemtype: element.itemtype,
                itemId: element.items_id,
            });
            }

            // Optionnel : reset du formulaire après succès
            setForm({
            name: "",
            content: "",
            type: 1,
            urgency: 3,
            impact: 3,
            priority: 3,
            });

            setSelectedElements([]);
            setSelectedTechnicianUserId(undefined);
            setSelectedTechnicianGroupId(undefined);
        } catch (error) {
            console.error(error);
        }
    }

    function resolveAssetType(displayOrTechnicalType: string) {
        const asset = assetsData?.find(
            (asset) =>
            asset.itemtype === displayOrTechnicalType ||
            asset.name === displayOrTechnicalType
        );

        return {
            itemtype: asset?.itemtype ?? displayOrTechnicalType,
            itemtypeLabel: asset?.name ?? displayOrTechnicalType,
        };
    }

    function addSelectedElement(newElement: SelectedTicketElement) {
        setSelectedElements((currentElements) => {
            const alreadyExists = currentElements.some(
            (element) =>
                element.itemtype === newElement.itemtype &&
                element.items_id === newElement.items_id
            );

            if (alreadyExists) {
            return currentElements;
            }

            return [...currentElements, newElement];
        });
    }

    function handleAddElement() {
        // Cas 1 : ajout depuis "Mes éléments"
        if (myAssetItemSelected) {
            const [rawItemtype, idText] = myAssetItemSelected.split(":");
            const itemId = Number(idText);

            const selectedItem = allGeneralViewAssetItemsPage?.find(
                (item) => item.itemType === rawItemtype && item.id === itemId
            );

            if (!selectedItem) {
                return;
            }

            const resolvedType = resolveAssetType(selectedItem.itemType);

            addSelectedElement({
                itemtype: resolvedType.itemtype,
                itemtypeLabel: resolvedType.itemtypeLabel,
                items_id: selectedItem.id,
                name: selectedItem.name,
            });

            setMyAssetItemSelected("");
            return;
        }

        // Cas 2 : ajout depuis "Ou recherche complète"
        if (!assetTypeItemSelected || !assetItemSelected) {
            return;
        }

        const selectedItem = assetItemsSelected?.find(
            (item) => String(item.id) === assetItemSelected
        );

        if (!selectedItem) {
            return;
        }

        const resolvedType = resolveAssetType(assetTypeItemSelected);

        addSelectedElement({
            itemtype: resolvedType.itemtype,
            itemtypeLabel: resolvedType.itemtypeLabel,
            items_id: selectedItem.id,
            name: selectedItem.name,
        });

        setAssetItemSelected("");
    }

    const groupedAssetsByItemType = useMemo(() => {
        const items = allGeneralViewAssetItemsPage ?? [];

        return items.reduce<Record<string, GeneralViewAssetItems[]>>((groups, item) => {
            const key = item.itemType || "Autre";

            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(item);

            return groups;
        }, {});
    }, [allGeneralViewAssetItemsPage]);

    if (isAssetItemsSelectedError) {
        return <div>
            <MyError>
                {getUserErrorMessage(assetItemsSelectedError, "Erreur lors du chargement des Items de l'Asset")}
            </MyError>
        </div>
    }

    if (isAllGeneralViewAssetItemsError) {
        return <div>
            <MyError>
                {getUserErrorMessage(allGeneralViewAssetItemsError, "Erreur lors du chargement de mes Assets")}
            </MyError>
        </div>
    }

    if (isAssetsError) {
        return <div>
            <MyError>
                {getUserErrorMessage(assetsError, "Erreur lors du chargement des Assets")}
            </MyError>
        </div>
    }

    if (isUsersError) {
        return <div>
            <MyError>
                {getUserErrorMessage(usersError, "Erreur lors du chargement des utilisateurs")}
            </MyError>
        </div>
    }

    if (isGroupsError) {
        return <div>
            <MyError>
                {getUserErrorMessage(groupsError, "Erreur lors du chargement des groupes")}
            </MyError>
        </div>
    }
    
    if (isCreatePrinterError) {
        return <MyError>
            <p>{getUserErrorMessage(createPrinterError, "Erreur lors de la création du ticket.")}</p>

            {import.meta.env.DEV && (
                <pre className="mt-4 whitespace-pre-wrap rounded bg-red-100 p-3 text-xs">
                {getDeveloperErrorDetails(createPrinterError)}
                </pre>
            )}
        </MyError>
    }

    if (isTicketSuccess) {
        return  <>
            <div className="rounded-[30px] p-5 bg-green-200 text-green-500">
                Votre Ticket a été créer avec succès
            </div>
            <Button className="mt-3" onClick={() => window.location.reload()}>
                Retour
            </Button>
        </>
    }

    return<>
        <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
            <Label htmlFor="ticketUser">Utilisateur demandeur</Label>
            <Select
                id="ticketUser"
                value={selectedUserId ? String(selectedUserId) : ""}
                onChange={(event) => {
                    const value = event.target.value;

                    setSelectedUserId(value ? Number(value) : undefined);
                    setMyAssetItemSelected("");
                }}
            >
                <option value="">Choisir un utilisateur</option>
                {users
                    .filter((user) => !user.is_deleted)
                    .map((user) => {
                        const fullName = `${user.firstname} ${user.realname}`.trim();
                        const label = fullName.length > 0 ? fullName : user.username;

                        return (
                            <option key={user.id} value={String(user.id)}>
                                {label} ({user.username})
                            </option>
                        );
                    })}
            </Select>

            <Label htmlFor="ticketTechnicianUser">Utilisateur technicien</Label>
            <Select
                id="ticketTechnicianUser"
                value={selectedTechnicianUserId ? String(selectedTechnicianUserId) : ""}
                onChange={(event) => {
                    const value = event.target.value;

                    setSelectedTechnicianUserId(value ? Number(value) : undefined);
                }}
            >
                <option value="">Choisir un technicien</option>
                {users
                    .filter((user) => !user.is_deleted)
                    .map((user) => {
                        const fullName = `${user.firstname} ${user.realname}`.trim();
                        const label = fullName.length > 0 ? fullName : user.username;

                        return (
                            <option key={`technician-${user.id}`} value={String(user.id)}>
                                {label} ({user.username})
                            </option>
                        );
                    })}
            </Select>

            <Label htmlFor="ticketTechnicianGroup">Groupe de technicien</Label>
            <Select
                id="ticketTechnicianGroup"
                value={selectedTechnicianGroupId ? String(selectedTechnicianGroupId) : ""}
                onChange={(event) => {
                    const value = event.target.value;

                    setSelectedTechnicianGroupId(value ? Number(value) : undefined);
                }}
            >
                <option value="">Choisir un groupe technicien</option>
                {groups.map((group) => (
                    <option key={group.id} value={String(group.id)}>
                        {group.name}
                    </option>
                ))}
            </Select>

            <Label htmlFor="ticketName" id="titre">Titre ticket</Label>
            <Input 
                value={form.name}
                id="ticketName" type="text" 
                onChange={(event) => {
                    setForm({
                        ...form,
                        name: event.target.value
                    });
                }}
            />
            <Label htmlFor="contentTicket">Description</Label>
            <Textarea 
                value={form.content}
                onChange={(event) => {
                    setForm({
                        ...form,
                        content: event.target.value
                    });
                }}
                id="contentTicket" />
            
            <Label>Type Ticket</Label>
            <Select
                value={form.type}
                onChange={(event) => {
                    setForm({
                        ...form,
                        type: Number(event.target.value)
                    })
                }}
            >
                {Object.entries(TICKET_TYPE_LABELS).map( ([type, label]) => {
                    return <option key={type} value={type}>{label}</option>
                })}
                
            </Select>

            <Label htmlFor="elementsTicket">Element</Label>

            <div className="flex">
                <span>Mes éléments</span>

                <Select
                    id="mesElements"
                    value={myAssetItemSelected}
                    onChange={(event) => {
                        setMyAssetItemSelected(event.target.value);
                        setAssetTypeItemSelected("");
                        setAssetItemSelected("");
                    }}
                    >
                    <option value="">--------</option>

                    {selectedUserId === undefined && (
                        <option value="" disabled>
                            Sélectionnez d&apos;abord un utilisateur
                        </option>
                    )}

                    {Object.entries(groupedAssetsByItemType).map(([itemType, items]) => (
                        <optgroup key={itemType} label={itemType}>
                        {items.map((item) => (
                            <option
                            key={`${item.itemType}-${item.id}`}
                            value={`${item.itemType}:${item.id}`}
                            >
                            {item.name}
                            </option>
                        ))}
                        </optgroup>
                    ))}
                    </Select>
                </div>
            
            <div className="flex">
                <span className="mr-5">Ou recherche complète</span>
                <div className="flex flex-1 flex-col gap-3">
                    <Select
                        id="elementGlobal"
                        value={assetTypeItemSelected}
                        onChange={(event) => setAssetTypeItemSelected(event.target.value)}
                    >
                        <option value="">Général</option>
                        {assetsData && assetsData.length > 0 && assetsData.map((asset) => (
                            <option key={asset.itemtype} value={asset.itemtype}>{asset.name}</option>
                        ))}
                    </Select>

                    {assetTypeItemSelected !== "" &&
                        <Select
                            value={assetItemSelected}
                            onChange={(event) => setAssetItemSelected(event.target.value)}
                        >
                            <option value="">-----</option>
                            {assetItemsSelected && assetItemsSelected.length > 0 && assetItemsSelected.map((assetItem) => (
                                <option key={assetItem.id} value={assetItem.id}>{assetItem.name}</option>
                            ))}
                        </Select>
                    }
                </div>
            </div>
            
            <div>
                <Button type="button" className="justify-center" onClick={handleAddElement}><Plus />Add</Button>
            </div>
            {selectedElements.length > 0 && (
                <div className="rounded-2xl border border-(--panel-border) p-4">
                    <p className="mb-3 font-semibold">Éléments ajoutés au ticket</p>

                    <div className="flex flex-col gap-2">
                    {selectedElements.map((element) => (
                        <div
                        key={`${element.itemtype}-${element.items_id}`}
                        className="flex items-center justify-between rounded-xl bg-(--panel-soft) px-4 py-3"
                        >
                        <span>
                            {element.itemtypeLabel} — {element.name}
                        </span>

                        <Button
                            type="button"
                            isWithBackground={false}
                            onClick={() => {
                            setSelectedElements(
                                selectedElements.filter(
                                (currentElement) =>
                                    !(
                                    currentElement.itemtype === element.itemtype &&
                                    currentElement.items_id === element.items_id
                                    )
                                )
                            );
                            }}
                        >
                            Retirer
                        </Button>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            {isModal ?
            <div className="flex gap-3">
                    <Button
                        type="button"
                        isWithBackground={false}
                        className="w-full flex items-center flex-col"
                        onClick={onClose}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" className="w-full flex items-center flex-col">
                        {isCreatingTicket ? "Création Ticket..." : "Valider"}
                    </Button>
                </div>
            : <Button type="submit" className="justify-center">
                {isCreatingTicket ? "Création Ticket..." : "Valider"}
            </Button>}
        </form>

        
    </>
}
