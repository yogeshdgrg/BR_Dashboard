import React, { useState } from "react";

const EditProductSidebar = ({ productData, onSave }) => {
  const [formData, setFormData] = useState({
    name: productData?.name || "",
    description: productData?.description || "",
    category: productData?.category || "",
    sizes: productData?.sizes || [],
    images: productData?.images || [],
    feature: productData?.feature || [],
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle dynamic array changes (sizes, features)
  const handleArrayChange = (e, field, index) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  // Add new item to dynamic arrays
  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  // Remove item from dynamic arrays
  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  // Handle save
  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="p-4 bg-gray-50 border-l border-gray-200 h-full">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <form>
        <label className="block mb-2">
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          ></textarea>
        </label>

        <label className="block mb-2">
          Category
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <div className="mb-4">
          <h3 className="font-medium">Sizes</h3>
          {formData.sizes.map((size, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                value={size}
                onChange={(e) => handleArrayChange(e, "sizes", index)}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("sizes", index)}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("sizes")}
            className="mt-2 text-blue-500"
          >
            Add Size
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">Features</h3>
          {formData.feature.map((feat, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                value={feat}
                onChange={(e) => handleArrayChange(e, "feature", index)}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("feature", index)}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("feature")}
            className="mt-2 text-blue-500"
          >
            Add Feature
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">Images</h3>
          {formData.images.map((img, index) => (
            <div key={img._id} className="flex items-center mt-2">
              <img
                src={img.image}
                alt={`Image ${index + 1}`}
                className="w-16 h-16 object-cover rounded"
              />
              <input
                type="text"
                value={img.image}
                onChange={(e) => {
                  const newImages = [...formData.images];
                  newImages[index].image = e.target.value;
                  setFormData({ ...formData, images: newImages });
                }}
                className="flex-1 p-2 border rounded ml-2"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    images: formData.images.filter((_, i) => i !== index),
                  })
                }
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                images: [...formData.images, { image: "", _id: Date.now() }],
              })
            }
            className="mt-2 text-blue-500"
          >
            Add Image
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProductSidebar;
