for current in geometry do
(
    select current
    newFileName = current.name
    newFilePath = "D:\\TEST" 
    completeFilePath = (newFilePath + "/" + newFileName)
    
    --exportFile completeFilePath #noPrompt selectedOnly:true using:FBXEXP
	exportFile completeFilePath #noPrompt selectedOnly:true using:OBJExp
)

clearSelection()