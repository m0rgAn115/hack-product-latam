import { Category_Transactions } from "../Interfaces/transaction.interface";

const expensesPerMonth: { [month: number]: Category_Transactions[] } = {
  0: [
    {
      category: { name: "Vivienda", icon: "housing" },
      transacciones: [
        { titulo: "Renta", monto: 6000, categoria: "Vivienda", fecha: "2024-01-01" }
      ]
    },
    {
      category: { name: "Alimentación", icon: "food" },
      transacciones: [
        { titulo: "Supermercado", monto: 1300, categoria: "Alimentación", fecha: "2024-01-05" }
      ]
    },
    {
      category: { name: "Entretenimiento", icon: "entertainment" },
      transacciones: [
        { titulo: "Netflix", monto: 150, categoria: "Entretenimiento", fecha: "2024-01-15" }
      ]
    }
  ],
  1: [
    {
      category: { name: "Transporte", icon: "transport" },
      transacciones: [
        { titulo: "Gasolina", monto: 800, categoria: "Transporte", fecha: "2024-02-12" }
      ]
    },
    {
      category: { name: "Educación", icon: "education" },
      transacciones: [
        { titulo: "Curso en línea", monto: 500, categoria: "Educación", fecha: "2024-02-20" }
      ]
    }
  ],
  2: [
    {
      category: { name: "Salud y Bienestar", icon: "health" },
      transacciones: [
        { titulo: "Gimnasio", monto: 300, categoria: "Salud y Bienestar", fecha: "2024-03-10" },
        { titulo: "Vitaminas", monto: 100, categoria: "Salud y Bienestar", fecha: "2024-03-15" }
      ]
    },
    {
      category: { name: "Ropa y Cuidado Personal", icon: "shopping" },
      transacciones: [
        { titulo: "Compra de ropa", monto: 900, categoria: "Ropa y Cuidado Personal", fecha: "2024-03-22" }
      ]
    }
  ],
  3: [
    {
      category: { name: "Deudas y Ahorros", icon: "debts" },
      transacciones: [
        { titulo: "Pago de tarjeta de crédito", monto: 2000, categoria: "Deudas y Ahorros", fecha: "2024-04-05" },
        { titulo: "Ahorro mensual", monto: 1000, categoria: "Deudas y Ahorros", fecha: "2024-04-30" }
      ]
    },
    {
      category: { name: "Otros Gastos", icon: "other" },
      transacciones: [
        { titulo: "Regalos", monto: 450, categoria: "Otros", fecha: "2024-04-25" }
      ]
    }
  ],
  4: [
    {
      category: { name: "Entretenimiento", icon: "entertainment" },
      transacciones: [
        { titulo: "Concierto", monto: 1200, categoria: "Entretenimiento", fecha: "2024-05-18" }
      ]
    },
    {
      category: { name: "Transporte", icon: "transport" },
      transacciones: [
        { titulo: "Uber", monto: 300, categoria: "Transporte", fecha: "2024-05-25" }
      ]
    }
  ],
  5: [
    {
      category: { name: "Vivienda", icon: "housing" },
      transacciones: [
        { titulo: "Renta", monto: 6000, categoria: "Vivienda", fecha: "2024-06-01" }
      ]
    },
    {
      category: { name: "Educación", icon: "education" },
      transacciones: [
        { titulo: "Curso avanzado", monto: 700, categoria: "Educación", fecha: "2024-06-10" }
      ]
    },
    {
      category: { name: "Salud y Bienestar", icon: "health" },
      transacciones: [
        { titulo: "Clases de yoga", monto: 250, categoria: "Salud y Bienestar", fecha: "2024-06-20" }
      ]
    }
  ],
  6: [
    {
      category: { name: "Alimentación", icon: "food" },
      transacciones: [
        { titulo: "Cena en restaurante", monto: 500, categoria: "Alimentación", fecha: "2024-07-04" }
      ]
    },
    {
      category: { name: "Otros Gastos", icon: "other" },
      transacciones: [
        { titulo: "Reparación de teléfono", monto: 300, categoria: "Otros", fecha: "2024-07-12" }
      ]
    }
  ],
  7: [
    {
      category: { name: "Vivienda", icon: "housing" },
      transacciones: [
        { titulo: "Renta", monto: 6000, categoria: "Vivienda", fecha: "2024-08-01" }
      ]
    },
    {
      category: { name: "Transporte", icon: "transport" },
      transacciones: [
        { titulo: "Didi", monto: 250, categoria: "Transporte", fecha: "2024-08-10" }
      ]
    },
    {
      category: { name: "Deudas y Ahorros", icon: "debts" },
      transacciones: [
        { titulo: "Pago préstamo", monto: 1500, categoria: "Deudas y Ahorros", fecha: "2024-08-20" }
      ]
    }
  ],
  8: [
    {
      category: { name: "Ropa y Cuidado Personal", icon: "shopping" },
      transacciones: [
        { titulo: "Compra de ropa", monto: 750, categoria: "Ropa y Cuidado Personal", fecha: "2024-10-10" }
      ]
    },
    {
      category: { name: "Salud y Bienestar", icon: "health" },
      transacciones: [
        { titulo: "Masaje", monto: 400, categoria: "Salud y Bienestar", fecha: "2024-10-15" }
      ]
    }
  ],
  9: [
    {
      category: { name: "Transporte", icon: "transport" },
      transacciones: [
        { titulo: "Uber", monto: 350, categoria: "Transporte", fecha: "2024-11-25" },
        { titulo: "Didi", monto: 250, categoria: "Transporte", fecha: "2024-11-28" }
      ]
    },
    {
      category: { name: "Alimentación", icon: "food" },
      transacciones: [
        { titulo: "KFC", monto: 52, categoria: "Alimentación", fecha: "2024-11-20" },
        { titulo: "Supermercado", monto: 900, categoria: "Alimentación", fecha: "2024-11-22" }
      ]
    },
    {
      category: { name: "Entretenimiento", icon: "entertainment" },
      transacciones: [
        { titulo: "Cine", monto: 180, categoria: "Entretenimiento", fecha: "2024-11-18" },
        { titulo: "Concierto", monto: 2500, categoria: "Entretenimiento", fecha: "2024-11-25" }
      ]
    }
  ],
  10: [
    {
      category: { name: "Otros Gastos", icon: "other" },
      transacciones: [
        { titulo: "Regalos navideños", monto: 1200, categoria: "Otros", fecha: "2024-11-20" }
      ]
    },
    {
      category: { name: "Alimentación", icon: "food" },
      transacciones: [
        { titulo: "Cena de Navidad", monto: 1000, categoria: "Alimentación", fecha: "2024-11-24" }
      ]
    }
  ],
  11: [
    {
      category: { name: "Vivienda", icon: "housing" },
      transacciones: [
        { titulo: "Renta", monto: 3000, categoria: "Vivienda", fecha: "2024-12-01" }
      ]
    },
    {
      category: { name: "Deudas y Ahorros", icon: "debts" },
      transacciones: [
        { titulo: "Pago préstamo", monto: 2000, categoria: "Deudas y Ahorros", fecha: "2024-12-15" }
      ]
    },
    {
      category: { name: "Transporte", icon: "transport" },
      transacciones: [
        { titulo: "Gasolina", monto: 700, categoria: "Transporte", fecha: "2024-12-20" }
      ]
    }
  ]
};

export default expensesPerMonth;