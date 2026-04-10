def search(query_vector, k=5):
    index = faiss.read_index("faiss.index")
    distances, indices = index.search(np.array([query_vector]), k)
    return indices[0]