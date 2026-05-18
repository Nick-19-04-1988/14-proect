## Express REST API — Примеры запросов

Сервер запущен на **http://localhost:5000**

### GET — Получить все элементы

```bash
curl http://localhost:5000/api/items
```

**Ответ:**

```json
[
    { "id": 1, "title": "Item 1", "description": "First item" },
    { "id": 2, "title": "Item 2", "description": "Second item" }
]
```

### GET — Получить один элемент

```bash
curl http://localhost:5000/api/items/1
```

**Ответ:**

```json
{ "id": 1, "title": "Item 1", "description": "First item" }
```

### POST — Создать новый элемент

```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title": "New Item", "description": "Item description"}'
```

**Ответ:**

```json
{ "id": 3, "title": "New Item", "description": "Item description" }
```

### PUT — Обновить элемент

```bash
curl -X PUT http://localhost:5000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Item", "description": "Updated description"}'
```

**Ответ:**

```json
{ "id": 1, "title": "Updated Item", "description": "Updated description" }
```

### DELETE — Удалить элемент

```bash
curl -X DELETE http://localhost:5000/api/items/1
```

**Ответ:**

```json
{ "id": 1, "title": "Updated Item", "description": "Updated description" }
```

---

## JavaScript fetch примеры

### GET запрос

```javascript
fetch('http://localhost:5000/api/items')
    .then((res) => res.json())
    .then((data) => console.log(data));
```

### POST запрос

```javascript
fetch('http://localhost:5000/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'New Item', description: 'Description' }),
})
    .then((res) => res.json())
    .then((data) => console.log(data));
```

### PUT запрос

```javascript
fetch('http://localhost:5000/api/items/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Updated', description: 'New desc' }),
})
    .then((res) => res.json())
    .then((data) => console.log(data));
```

### DELETE запрос

```javascript
fetch('http://localhost:5000/api/items/1', {
    method: 'DELETE',
})
    .then((res) => res.json())
    .then((data) => console.log(data));
```

---

## Запуск

```bash
# Запустить сервер
npm run server

# Или собрать и запустить сервер (использует dist папку)
npm run dev:full
```

Сервер слушает на **порту 5000** и подает статические файлы из папки **`dist`** (production-сборка).
