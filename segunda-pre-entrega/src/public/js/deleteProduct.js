document.getElementById('deleteProductForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const pid = document.getElementById('pid').value;

    try {
        const response = await fetch(`http://localhost:8080/api/products/delete/${pid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`¡Error HTTP! estado: ${response.status}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        if (result.result === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Producto eliminado',
                text: 'El producto se ha eliminado con éxito',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error || 'Error desconocido',
            });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Hubo un error al eliminar el producto: ${error.message}`,
        });
    }
})