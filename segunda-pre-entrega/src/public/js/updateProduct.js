document.getElementById('updateProductForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const pid = document.getElementById('pid').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const status = document.getElementById('status').value;

    const productToUpdate = {
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        stock,
        status
    };

    try {
        const response = await fetch(`http://localhost:8080/api/products/put/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productToUpdate)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Server response:', result);

        if (result.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Producto actualizado',
                text: 'El producto se ha actualizado con éxito',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error || 'Error desconocido',
            });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Hubo un error al actualizar el producto: ${error.message}`,
        });
    }
});