import React, { useState, useEffect } from 'react'
import { Layout, PageBlock, Table, Button, EXPERIMENTAL_Select as Select } from 'vtex.styleguide'

interface ItemTable {
  product: string,
  suggestion: string,
  count: number
}

function WeeklySuggestions() {
  const [itemsTable, setItemsTable] = useState<ItemTable[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>('08')

  const API = 'https://bitsized.socialfitness.com.br/api'

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const tableSchema = {
    properties: {
      product: {
        title: 'Produto',
        cellRenderer: (rowData:any) => {
          return (
            <div>      
              <span style={{whiteSpace:'normal'}}>
                {rowData.cellData}
              </span>
            </div>
          )
        }
      },
      suggestion: {
        title: 'Sugestão',
        cellRenderer: (rowData:any) => {
          return (
            <div>
              <span style={{whiteSpace:'normal'}}>
                {rowData.cellData}
              </span>
            </div>
          )
        }
      },
      count: {
        title:'Vendas',
        width:80,
        cellRenderer: (rowData:any) => {
          return (
            <span style={{margin:'auto'}}>
              {rowData.cellData}
            </span>
          )
        }
      }
    }
  }

  const options = [
    {
      value:'01',
      label:"Janeiro - 2022"
    },

    {
      value:'02',
      label:"Fevereiro - 2022"
    },

    {
      value:'03',
      label:"Março - 2022"
    },

    {
      value:'04',
      label:"Abril - 2022"
    },

    {
      value:'05',
      label:"Maio - 2022"
    },

    {
      value:'06',
      label:"Junho - 2022"
    },

    {
      value:'07',
      label:"Julho - 2022"
    },

    {
      value:'08',
      label:"Agosto - 2022"
    },
  ]

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true)
    let allItems:ItemTable[] = []
    const res = await fetch(`${API}/suggestion-results/?period=2022-08`)
    const json = await res.json()
    const content = json.data.content
    content.forEach((item:any) => {
      const newItem: ItemTable = {
        product: item.product.productName,
        suggestion: item.suggested.productName,
        count: item.countOrdersWithThisSuggestion
      }
      allItems.push(newItem)
    })
    allItems = allItems.sort((a, b) => a.count >= b.count ? -1 : 1)
    console.log(allItems)
    setItemsTable(allItems)
    setSuggestionsLoading(false)
  }

  return (
    <Layout>
      <PageBlock 
        variation="full"
        title="Relatório das sugestões"
        subtitle="Para cada sugestão criada, é mostrada a quantidade de vendas."
      >
      <Select 
        placeholder="Selecione o mês"
        options={options}
        multi={false}
        onChange={(values:any) => {
          console.log(values.value, selected)
          setSelected(values.value)
        }}
        defaultValue={ {value:'08', label:"Agosto - 2022"} }
      />
      <div className="flex mt5 flex-column justify-center items-center">
        <Button 
          size="small"
          variation="secondary"
          >
          Visualizar mês
        </Button>
      </div>
      <div className="mb5">
        <Table
          fullWidth
          schema={tableSchema}
          items={itemsTable}
          loading={suggestionsLoading}
          dynamicRowHeight={true}
        />
      </div>
      </PageBlock>
    </Layout>
  )
}

export default WeeklySuggestions


