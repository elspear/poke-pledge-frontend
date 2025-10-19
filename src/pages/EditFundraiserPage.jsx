import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FundraiserForm from "../components/CreateFundraiserForm";
import getFundraiser from "../api/get-fundraiser";
import updateFundraiser from "../api/update-fundraiser";
import deleteFundraiser from "../api/delete-fundraiser";

function EditFundraiserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fundraiser, setFundraiser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchFundraiser() {
            setLoading(true);
            setError(null);
            try {
                const data = await getFundraiser(id);
                setFundraiser(data);
            } catch (err) {
                setError(err.message || "Failed to load fundraiser");
            } finally {
                setLoading(false);
            }
        }
        fetchFundraiser();
    }, [id]);

    const handleUpdate = async (updatedData) => {
        setSaving(true);
        try {
            await updateFundraiser(id, updatedData);
            navigate(`/fundraiser/${id}`);
        } catch (err) {
            setError(err.message || "Failed to update fundraiser");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await deleteFundraiser(id);
            navigate("/");
        } catch (err) {
            setError(err.message || "Failed to delete fundraiser");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading fundraiser...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!fundraiser) return <div>Fundraiser not found.</div>;

    return (
        <FundraiserForm
            initialValues={fundraiser}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
            mode="edit"
            isLoading={saving}
        />
    );
}

export default EditFundraiserPage;